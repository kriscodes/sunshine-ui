import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ImageSlider – image rotator with optional last-slide video (no-flash blackout switch).
 *
 * Props:
 *  - images: (string | { src: string, alt?: string })[]
 *  - videoSrc?: string                // optional; appended as LAST slide
 *  - intervalMs?: number              // per-image dwell time; default 6000
 *  - fadeMs?: number                  // blackout fade duration; default 450
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
  debug = false,
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

  // Prefetch a blob version of the video (avoids dev Range issues)
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  useEffect(() => {
    let objectUrl;
    let aborted = false;
    async function prefetchBlob() {
      if (!videoSrc) return;
      try {
        const resp = await fetch(videoSrc);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        if (aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setVideoBlobUrl(objectUrl);
        if (debug) console.log('[ImageSlider] video blob ready:', objectUrl);
      } catch (e) {
        if (debug) console.warn('[ImageSlider] video blob fetch failed; using direct URL', e);
      }
    }
    prefetchBlob();
    return () => {
      aborted = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoSrc, debug]);

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
  const [isBlackout, setIsBlackout] = useState(false);     // black overlay state
  const [isTransitioning, setIsTransitioning] = useState(false); // block timers during swap
  const timerRef = useRef(null);
  const swapOutRef = useRef(null);
  const swapInRef = useRef(null);

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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (swapOutRef.current) clearTimeout(swapOutRef.current);
      if (swapInRef.current) clearTimeout(swapInRef.current);
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ***** Blackout switch (prevents flash) *****
  const blackoutSwitch = useCallback(
    (toIndex) => {
      if (isTransitioning || !slides.length) return;
      setIsTransitioning(true);
      // Phase 1: fade to black
      setIsBlackout(true);
      swapOutRef.current = setTimeout(() => {
        // Phase 2: swap instantly under blackout (no slide opacity transitions)
        setIndex(toIndex);
        // Phase 3: after a paint, fade back from black
        requestAnimationFrame(() => {
          setIsBlackout(false);
          swapInRef.current = setTimeout(() => {
            setIsTransitioning(false);
          }, fadeMs);
        });
      }, fadeMs);
    },
    [isTransitioning, slides.length, fadeMs]
  );

  const goToNext = useCallback(() => {
    if (!slides.length) return;
    const next = (index + 1) % slides.length;
    blackoutSwitch(next);
  }, [index, slides.length, blackoutSwitch]);

  const goToFirst = useCallback(() => {
    blackoutSwitch(0);
  }, [blackoutSwitch]);

  // Auto-advance images (no timers during transition or on video)
  useEffect(() => {
    clearTimer();
    if (!hasSlides || isTransitioning) return;
    const current = slides[index];
    if (!current || current.type === 'video') return;
    timerRef.current = setTimeout(goToNext, intervalMs);
    return clearTimer;
  }, [index, slides, hasSlides, intervalMs, goToNext, clearTimer, isTransitioning]);

  // Activate video when we land on the last slide
  useEffect(() => {
    if (!hasVideo || index !== videoIndex) return;
    const v = videoEl.current;
    if (!v) return;
    const srcToUse = slides[videoIndex]?.src;
    if (!srcToUse) return;

    if (debug) console.log('[ImageSlider] activating video:', srcToUse);

    v.src = srcToUse;    // blob if available, else direct URL
    v.muted = true;      // required for autoplay
    v.playsInline = true;
    v.autoplay = true;
    try { v.load(); } catch {}
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => { /* autoplay may be blocked */ });

    const onError = () => {
      if (debug) console.warn('[ImageSlider] video element error -> goToFirst');
      // If it fails, just go back gracefully
      goToFirst();
    };
    v.addEventListener('error', onError);
    return () => v.removeEventListener('error', onError);
  }, [hasVideo, index, videoIndex, slides, goToFirst, debug]);

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

  const isActive = (i) => i === index;

  return (
    <div
      className={`image-slider ${className}`}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', minHeight }}
    >
      {slides.map((s, i) => {
        const active = isActive(i);
        // IMPORTANT: no per-slide opacity transition -> swap is instant under blackout (no flash)
        const baseStyle = {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: active ? 1 : 0,
          transition: 'none',
          pointerEvents: active ? 'auto' : 'none',
          backgroundColor: '#000',
        };

        if (s.type === 'video') {
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
              // src is set in the activation effect
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
              if (active) goToNext();
            }}
          />
        );
      })}

      {/* Blackout overlay controls the visual fade (in/out) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          opacity: isBlackout ? 1 : 0,
          transition: `opacity ${fadeMs}ms ease`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
