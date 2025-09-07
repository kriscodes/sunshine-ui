import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';

/**
 * ImageSlider with optional last-slide video.
 *
 * Props:
 *  - images: string[]                // image URLs (existing behavior)
 *  - videoSrc?: string               // optional; appends as the LAST slide (e.g., "/sunshine-web.mp4")
 *  - intervalMs?: number             // image display time (default 6000ms)
 *  - fadeMs?: number                 // fade duration between slides (default 450ms)
 *  - className?: string
 *
 * Usage:
 *   <ImageSlider
 *     images={['/hero1.jpg','/hero2.jpg','/hero3.jpg']}
 *     videoSrc="/sunshine-web.mp4"
 *   />
 *
 * Notes:
 *  - If the last item in `images` is an .mp4, it will be treated as the video and moved to the end,
 *    so you can also just include it in your images array.
 *  - Video autoplays muted (browser policy) and jumps back to the first slide on end.
 */
export default function ImageSlider({
  images = [],
  videoSrc,                 // optional, e.g. '/sunshine-web.mp4'
  intervalMs = 6000,
  fadeMs = 450,
  className = '',
}) {
  // Normalize slides: all images first, OPTIONAL video last.
  const slides = useMemo(() => {
    const imgSlides = [];
    let foundVideo = null;

    // Accept strings; treat ".mp4" as video if present in images
    for (const src of images) {
      if (typeof src === 'string' && /\.mp4(\?.*)?$/i.test(src)) {
        // If someone accidentally placed the mp4 among images, capture it
        foundVideo = { type: 'video', src };
      } else if (typeof src === 'string') {
        imgSlides.push({ type: 'image', src });
      } else if (src && typeof src === 'object' && src.src) {
        if (src.type === 'video') foundVideo = { type: 'video', src: src.src };
        else imgSlides.push({ type: 'image', src: src.src });
      }
    }

    // Explicit prop wins
    if (typeof videoSrc === 'string' && videoSrc.trim()) {
      foundVideo = { type: 'video', src: videoSrc.trim() };
    }

    return foundVideo ? [...imgSlides, foundVideo] : imgSlides;
  }, [images, videoSrc]);

  const hasVideo = slides.some(s => s.type === 'video');
  const videoIndex = hasVideo ? slides.findIndex(s => s.type === 'video') : -1;

  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToNext = useCallback(() => {
    setFading(true);
    // Fade to black, then swap
    setTimeout(() => {
      setIndex(prev => (prev + 1) % slides.length);
      setFading(false);
    }, fadeMs);
  }, [slides.length, fadeMs]);

  // Auto-advance logic:
  // - On image slides: wait intervalMs -> fade -> next
  // - On video slide: pause timer, autoplay video; on end -> jump to first slide (index 0)
  useEffect(() => {
    clearTimer();

    if (!slides.length) return;

    const current = slides[index];

    if (current.type === 'video') {
      // No timer while video plays
      const v = videoRef.current;
      if (v) {
        try {
          v.currentTime = 0;
          // autoplay policies require muted + playsInline (set on element)
          const p = v.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } catch {}
      }
      return () => {};
    }

    // Image slide: schedule next
    timerRef.current = setTimeout(goToNext, intervalMs);
    return clearTimer;
  }, [index, slides, intervalMs, goToNext, clearTimer]);

  // Cleanup
  useEffect(() => clearTimer, [clearTimer]);

  const handleVideoEnded = () => {
    // When the video ends, jump back to FIRST image.
    setFading(true);
    setTimeout(() => {
      setIndex(0);
      setFading(false);
    }, Math.min(180, fadeMs)); // quick fade so it feels snappy
  };

  // Small helper: is this slide active?
  const isActive = i => i === index;

  return (
    <div className={`image-slider ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Slides stacked; active gets opacity 1 */}
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
        };

        if (s.type === 'video') {
          return (
            <video
              key={`slide-video-${i}`}
              ref={i === videoIndex ? videoRef : null}
              className="image-slider__media image-slider__media--video"
              style={baseStyle}
              src={s.src}
              muted
              playsInline
              preload="metadata"
              // no controls; pure hero playback
              onEnded={handleVideoEnded}
            />
          );
        }

        return (
          <img
            key={`slide-image-${i}`}
            className="image-slider__media image-slider__media--image"
            style={baseStyle}
            src={s.src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        );
      })}

      {/* Fade-to-black overlay when transitioning images (kept very light) */}
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
