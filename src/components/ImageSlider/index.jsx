import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ImageSlider – images + multiple videos (videos play in given order).
 *
 * Props:
 *  - images: (string | { src: string, alt?: string })[]
 *  - videos?: string[]                 // NEW: one or more video URLs (order preserved)
 *  - videoSrc?: string                 // legacy single video (appended last)
 *  - videoSrc2?: string                // optional convenience second video (also appended)
 *  - intervalMs?: number               // per-image dwell time; default 6000
 *  - fadeMs?: number                   // blackout fade duration; default 450
 *  - minHeight?: string|number         // fallback height; default '60vh'
 *  - className?: string
 *  - debug?: boolean
 */
export default function ImageSlider({
  images = [],
  videos = [],
  videoSrc,
  videoSrc2,
  intervalMs = 6000,
  fadeMs = 450,
  minHeight = '60vh',
  className = '',
  debug = false,
}) {
  /* -------------------- Normalize inputs -------------------- */
  // Images (ignore accidental .mp4 entries)
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

  // Videos: allow videos[], videoSrc, videoSrc2 (dedup, keep order)
  const videoList = useMemo(() => {
    const arr = [];
    if (Array.isArray(videos)) arr.push(...videos);
    if (videoSrc) arr.push(videoSrc);
    if (videoSrc2) arr.push(videoSrc2);
    return Array.from(new Set(arr.filter(Boolean).map(String))); // unique, no empties
  }, [videos, videoSrc, videoSrc2]);

  /* -------------------- Prefetch videos to blobs -------------------- */
  const [videoBlobMap, setVideoBlobMap] = useState({});
  useEffect(() => {
    let cancelled = false;
    const createdUrls = [];

    (async () => {
      const updates = {};
      for (const src of videoList) {
        if (!src || videoBlobMap[src]) continue;
        try {
          const resp = await fetch(src);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          createdUrls.push(url);
          updates[src] = url;
          if (debug) console.log('[ImageSlider] video blob ready:', src);
        } catch (e) {
          if (debug) console.warn('[ImageSlider] blob fetch failed:', src, e);
        }
      }
      if (!cancelled && Object.keys(updates).length) {
        setVideoBlobMap(prev => ({ ...prev, ...updates }));
      }
    })();

    return () => {
      cancelled = true;
      createdUrls.forEach(u => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoList, debug]); // (intentionally not depending on videoBlobMap)

  /* -------------------- Build final slides -------------------- */
  const slides = useMemo(() => {
    const arr = [...imageSlides];
    for (const src of videoList) {
      arr.push({ type: 'video', src: videoBlobMap[src] || src });
    }
    return arr;
  }, [imageSlides, videoList, videoBlobMap]);

  const hasSlides = slides.length > 0;
  const poster = imageSlides[0]?.src || '';

  /* -------------------- Index + transitions -------------------- */
  const [index, setIndex] = useState(0);
  const [isBlackout, setIsBlackout] = useState(false);          // black screen overlay anim
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const swapOutRef = useRef(null);
  const swapInRef = useRef(null);
  const videoRefs = useRef({});                                  // index -> <video>

  // Clamp if slides change
  useEffect(() => {
    if (!hasSlides) { if (index !== 0) setIndex(0); return; }
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

  // Blackout swap: fade to black → swap instantly → fade in
  const blackoutSwitch = useCallback((toIndex) => {
    if (isTransitioning || !slides.length) return;
    setIsTransitioning(true);
    setIsBlackout(true);
    swapOutRef.current = setTimeout(() => {
      setIndex(toIndex);
      requestAnimationFrame(() => {
        setIsBlackout(false);
        swapInRef.current = setTimeout(() => setIsTransitioning(false), fadeMs);
      });
    }, fadeMs);
  }, [slides.length, isTransitioning, fadeMs]);

  const goToNext = useCallback(() => {
    if (!slides.length) return;
    const next = (index + 1) % slides.length;
    blackoutSwitch(next);
  }, [index, slides.length, blackoutSwitch]);

  const goToFirst = useCallback(() => blackoutSwitch(0), [blackoutSwitch]);

  // Auto-advance images only
  useEffect(() => {
    clearTimer();
    if (!hasSlides || isTransitioning) return;
    const current = slides[index];
    if (!current || current.type === 'video') return;
    timerRef.current = setTimeout(goToNext, intervalMs);
    return clearTimer;
  }, [index, slides, hasSlides, intervalMs, goToNext, clearTimer, isTransitioning]);

  /* -------------------- Activate video when visible -------------------- */
  useEffect(() => {
    const current = slides[index];
    if (!current || current.type !== 'video') return;
    const v = videoRefs.current[index];
    if (!v) return;

    // Pause any other video that might be playing
    Object.keys(videoRefs.current).forEach(k => {
      const i = Number(k);
      if (i !== index) {
        const other = videoRefs.current[i];
        try { other && other.pause && other.pause(); } catch {}
      }
    });

    v.muted = true;                 // required for autoplay on iOS
    v.playsInline = true;
    v.autoplay = true;
    v.preload = 'auto';
    if (poster) v.poster = poster;
    v.src = current.src;

    try { v.load(); } catch {}
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {
      if (debug) console.warn('[ImageSlider] autoplay blocked; user gesture may be required');
    });

    const onEnded = () => {
      // After ANY video ends, advance to the next slide (wraps to first image at end)
      goToNext();
    };
    const onError = () => {
      if (debug) console.warn('[ImageSlider] video error -> skipping slide');
      goToNext();
    };

    v.addEventListener('ended', onEnded);
    v.addEventListener('error', onError);
    return () => {
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('error', onError);
    };
  }, [index, slides, debug, goToNext, poster]);

  /* -------------------- Render -------------------- */
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
          transition: 'none',                 // swap happens under blackout (no flash)
          pointerEvents: active ? 'auto' : 'none',
          backgroundColor: '#000',
        };

        if (s.type === 'video') {
          return (
            <video
              key={`slide-video-${i}`}
              ref={(el) => { if (el) videoRefs.current[i] = el; }}
              className="image-slider__media image-slider__media--video"
              style={baseStyle}
              muted
              playsInline
              preload="auto"
              // src is set when activated
              poster={poster}
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

      {/* Blackout overlay controls all fades */}
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
