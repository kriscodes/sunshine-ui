import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ImageSlider – image rotator with optional last-slide video.
 *
 * Props:
 *  - images: (string | { src: string, alt?: string })[]
 *  - videoSrc?: string                // optional; appended as LAST slide
 *  - intervalMs?: number              // per-image dwell time; default 6000
 *  - fadeMs?: number                  // crossfade duration; default 450
 *  - minHeight?: string|number        // fallback height; default '60vh'
 *  - className?: string
 *  - debug?: boolean                  // logs to console
 */
export default function ImageSlider({
  images = [],
  videoSrc,
  intervalMs = 6000,
  fadeMs = 450,
  minHeight = '60vh',
  className = '',
  debug = true,
}) {
  // Normalize images (ignore accidental .mp4 entries)
  const imageSlides = useMemo(() => {
    const out = [];
    for (const item of images) {
      if (!item) continue;
      if (typeof item === 'string') {
        const s = item.trim();
        if (!s || /\.mp4(\?.*)?$/i.test(s)) continue;
        out.push({ type: 'image', src: s, alt: '' });
      } else if (typeof item === 'object') {
        const s = String(item.src || item.url || '').trim();
        if (!s || /\.mp4(\?.*)?$/i.test(s)) continue;
        out.push({ type: 'image', src: s, alt: item.alt || '' });
      }
    }
    return out;
  }, [images]);

  // Prefetch a blob version of the video (optional, avoids dev Range issues)
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [blobTried, setBlobTried] = useState(false);

  useEffect(() => {
    let objectUrl;
    let aborted = false;

    async function prefetchBlob() {
      if (!videoSrc || blobTried) return;
      setBlobTried(true);
      try {
        const resp = await fetch(videoSrc);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        if (aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setVideoBlobUrl(objectUrl);
        if (debug) console.log('[ImageSlider] video blob ready:', objectUrl);
      } catch (e) {
        if (debug) console.warn('[ImageSlider] video blob fetch failed; will use direct URL', e);
      }
    }

    prefetchBlob();

    return () => {
      aborted = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoSrc, blobTried, debug]);

  // Build slides: images + (optional) video LAST (prefer blob URL when available)
  const slides = useMemo(() => {
    const arr = [...imageSlides];
    if (videoSrc) arr.push({ type: 'video', src: videoBlobUrl || videoSrc });
    return arr;
  }, [imageSlides, videoSrc, videoBlobUrl]);

  const hasSlides = slides.length > 0;
  const hasVideo = !!videoSrc;
  const videoIndex = hasVideo ? slides.length - 1 : -1;

  // Index / animation
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const videoEl = useRef(null);

  // Clamp index if slides length changes
  useEffect(() => {
    if (!hasSlides) {
      if (index !== 0) setIndex(0);
      return;
    }
    const max = slides.length - 1;
    if (index > max) setIndex(max);
    if (index < 0) setIndex(0);
  }, [slides.length, hasSlides, index]);

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
      setIndex(prev => (prev + 1) % slides.length);
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

  // Auto-advance images
  useEffect(() => {
    clearTimer();
    if (!hasSlides) return;

    const current = slides[index];
    if (!current) return;
    if (current.type === 'video') return; // no timer on video

    timerRef.current = setTimeout(goToNext, intervalMs);
    return clearTimer;
  }, [index, slides, hasSlides, intervalMs, goToNext, clearTimer]);

  // Activate video when we land on the last slide
  useEffect(() => {
    if (!hasVideo || index !== videoIndex) return;
    const v = videoEl.current;
    if (!v) return;

    const srcToUse = slides[videoIndex]?.src;
    if (!srcToUse) return;

    if (debug) console.log('[ImageSlider] activating video:', srcToUse);

    // Prefer blob if available, otherwise direct URL
    v.src = srcToUse;
    v.muted = true;          // required for autoplay
    v.playsInline = true;
    v.autoplay = true;
    v.crossOrigin = 'anonymous';
    // Ensure the element is ready to load/play
    try { v.load(); } catch {}
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => { /* autoplay might be blocked */ });

    // If the direct URL errors, and we have a blob ready, switch once
    let switched = false;
    const onError = async () => {
      if (debug) console.warn('[ImageSlider] video error; trying blob fallback');
      if (!switched && videoBlobUrl && v.src !== videoBlobUrl) {
        switched = true;
        try {
          v.src = videoBlobUrl;
          v.load();
          const p2 = v.play();
          if (p2 && p2.catch) p2.catch(() => {});
          return;
        } catch {}
      }
      // If no blob available (or blob also fails), just go back to first image
      goToFirst();
    };

    v.addEventListener('error', onError);

    return () => {
      v.pause?.();
      v.removeEventListener('error', onError);
    };
  }, [hasVideo, index, videoIndex, slides, videoBlobUrl, goToFirst, debug]);

  const handleVideoEnded = () => {
    if (debug) console.log('[ImageSlider] video ended -> back to first image');
    if (imageSlides.length) goToFirst();
  };

  if (!hasSlides) {
    return (
      <div
        className={`image-slider ${className}`}
        style={{ position: 'relative', overflow: 'hidden', width: '100%', minHeight }}
      />
    );
  }

  const isActive = i => i === index;

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
          // Poster fallback: show the first image while the video starts
          const poster = imageSlides[0]?.src || '';
          return (
            <video
              key={`slide-video-${i}`}
              ref={videoEl}
              className="image-slider__media image-slider__media--video"
              style={baseStyle}
              poster={poster}
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              // src is set in the activation effect so we can swap to blob on error
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
              if (debug) console.warn('[ImageSlider] image failed, skipping:', s.src);
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
