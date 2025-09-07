import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ImageSlider – robust image rotator with optional last-slide video.
 *
 * Props:
 *  - images: (string | { src: string, alt?: string })[]
 *  - videoSrc?: string            // optional; when loaded, appended as the LAST slide
 *  - intervalMs?: number          // image dwell time (default 6000ms)
 *  - fadeMs?: number              // crossfade duration (default 450ms)
 *  - minHeight?: string|number    // fallback height; default '60vh'
 *  - className?: string
 *
 * Behavior:
 *  - Cycles images on a timer.
 *  - If a video is provided, it’s preloaded as a Blob; once ready, it becomes the last slide.
 *  - When the video slide becomes active: autoplay (muted, inline). On end: jump to the first image.
 *  - If the video fails to load, it’s never added; images keep rotating normally.
 */
export default function ImageSlider({
  images = [],
  videoSrc,
  intervalMs = 6000,
  fadeMs = 450,
  minHeight = '60vh',
  className = '',
}) {
  // --- normalize incoming images (allow strings or {src, alt}) ---
  const imageSlides = useMemo(() => {
    const out = [];
    for (const item of images) {
      if (!item) continue;
      if (typeof item === 'string') {
        const s = item.trim();
        if (!s || /\.mp4(\?.*)?$/i.test(s)) continue; // ignore accidental mp4s in images list
        out.push({ type: 'image', src: s, alt: '' });
      } else if (typeof item === 'object') {
        const s = String(item.src || item.url || '').trim();
        if (!s || /\.mp4(\?.*)?$/i.test(s)) continue;
        out.push({ type: 'image', src: s, alt: item.alt || '' });
      }
    }
    return out;
  }, [images]);

  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  // --- video preload state (Blob URL avoids dev-server Range issues) ---
  const videoEl = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);   // blob: URL once loaded
  const [videoReady, setVideoReady] = useState(false);
  const [videoTried, setVideoTried] = useState(false);

  // Preload video as a Blob right after mount or when videoSrc changes
  useEffect(() => {
    let aborted = false;
    let objectUrl = null;

    async function load() {
      if (!videoSrc || videoReady || videoTried) return;
      setVideoTried(true);
      try {
        const resp = await fetch(videoSrc);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        if (aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setVideoUrl(objectUrl);
        setVideoReady(true);
      } catch {
        // Ignore failure: we’ll just never add a video slide
        setVideoReady(false);
        setVideoUrl(null);
      }
    }

    load();
    return () => {
      aborted = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoSrc, videoReady, videoTried]);

  // Build final slides: all images + (optional) video last (only when ready)
  const slides = useMemo(() => {
    return videoReady && videoUrl
      ? [...imageSlides, { type: 'video', src: videoUrl }]
      : imageSlides;
  }, [imageSlides, videoReady, videoUrl]);

  const hasSlides = slides.length > 0;
  const hasVideo = slides.length > 0 && slides[slides.length - 1].type === 'video';
  const videoIndex = hasVideo ? slides.length - 1 : -1;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToNext = useCallback(() => {
    if (!slides.length) return;
    setFading(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setFading(false);
    }, fadeMs);
  }, [slides.length, fadeMs]);

  const goToFirst = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIndex(0);
      setFading(false);
    }, Math.min(180, fadeMs));
  }, [fadeMs]);

  // Auto-advance images on a timer (video controls its own timing)
  useEffect(() => {
    clearTimer();
    if (!hasSlides) return;

    const current = slides[index];
    if (current.type === 'video') return; // no timer on video

    timerRef.current = setTimeout(goToNext, intervalMs);
    return clearTimer;
  }, [index, slides, hasSlides, intervalMs, goToNext, clearTimer]);

  // When we enter the video slide, start playback as soon as possible
  useEffect(() => {
    if (!hasVideo || index !== videoIndex) return;
    const v = videoEl.current;
    if (!v) return;

    // Ensure the correct source is set (blob URL)
    v.src = slides[videoIndex].src;
    v.currentTime = 0;

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay might be blocked on some browsers; leave it paused but visible.
          // (Muted + playsInline should normally pass policy.)
        });
      }
    };

    // If can play already, try; otherwise wait for the event.
    if (v.readyState >= 2) tryPlay();
    else {
      const onCanPlay = () => {
        v.removeEventListener('canplay', onCanPlay);
        tryPlay();
      };
      v.addEventListener('canplay', onCanPlay);
      return () => v.removeEventListener('canplay', onCanPlay);
    }
  }, [hasVideo, index, videoIndex, slides]);

  // On video end, return to the first image
  const handleVideoEnded = () => {
    if (imageSlides.length) goToFirst();
    else {
      // If there are no images at all, loop the video
      const v = videoEl.current;
      if (v) {
        try { v.currentTime = 0; v.play(); } catch {}
      }
    }
  };

  if (!hasSlides) {
    return (
      <div
        className={`image-slider ${className}`}
        style={{ position: 'relative', overflow: 'hidden', width: '100%', minHeight }}
      />
    );
  }

  const isActive = (i) => i === index;

  return (
    <div
      className={`image-slider ${className}`}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', minHeight }}
    >
      {slides.map((s, i) => {
        const active = isActive(i);
        const baseStyle = {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: active ? 1 : 0,
          transition: `opacity ${fadeMs}ms ease`,
          pointerEvents: active ? 'auto' : 'none',
          backgroundColor: '#000',
        };

        if (s.type === 'video') {
          return (
            <video
              key={`slide-video-${i}`}
              ref={videoEl}
              className="image-slider__media image-slider__media--video"
              style={baseStyle}
              muted
              playsInline
              autoPlay           // help autoplay policies (with muted)
              preload="auto"
              onEnded={handleVideoEnded}
              onError={() => {
                // If something goes wrong at runtime, just fall back to images
                setTimeout(goToFirst, Math.min(300, fadeMs));
              }}
            />
          );
        }

        return (
          <img
            key={`slide-image-${i}`}
            className="image-slider__media image-slider__media--image"
            style={baseStyle}
            src={s.src}
            alt={s.alt || ''}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => {
              if (active) setTimeout(goToNext, Math.min(300, fadeMs));
            }}
          />
        );
      })}

      {/* Fade-to-black overlay during transitions */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          opacity: fading ? 1 : 0,
          transition: `opacity ${Math.max(1, Math.floor(fadeMs * 0.85))}ms ease`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
