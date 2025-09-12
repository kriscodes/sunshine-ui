import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ImageSlider – images + multiple videos (videos play in order).
 *
 * Props:
 *  - images: (string | { src: string, alt?: string })[]
 *  - videos?: string[]                 // optional; play in given order
 *  - videoSrc?: string                 // legacy single video (appended)
 *  - videoSrc2?: string                // convenience second video (appended)
 *  - intervalMs?: number               // per-image dwell time
 *  - interval?: number                 // alias for intervalMs
 *  - fadeMs?: number                   // blackout fade duration
 *  - fadeDuration?: number             // alias for fadeMs
 *  - holdBlack?: number                // extra ms to hold blackout before fade-in (default 0)
 *  - minHeight?: string|number         // min height (e.g., '60vh')
 *  - height?: string|number            // fixed height if desired
 *  - startAtIndex?: number             // optional starting index (clamped)
 *  - className?: string
 *  - debug?: boolean
 */
export default function ImageSlider({
  images = [],
  videos = [],
  videoSrc,
  videoSrc2,
  intervalMs,
  interval,
  fadeMs,
  fadeDuration,
  holdBlack = 0,
  minHeight = '60vh',
  height,
  startAtIndex,
  className = '',
  debug = false,
}) {
  /* ---------- normalize timing props ---------- */
  const dwell = typeof intervalMs === 'number' ? intervalMs
              : typeof interval === 'number'   ? interval
              : 6000;
  const fade = typeof fadeMs === 'number' ? fadeMs
             : typeof fadeDuration === 'number' ? fadeDuration
             : 450;

  /* ---------- normalize images ---------- */
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

  /* ---------- normalize videos (order preserved, dedup) ---------- */
  const videoList = useMemo(() => {
    const arr = [];
    if (Array.isArray(videos)) arr.push(...videos);
    if (videoSrc) arr.push(videoSrc);
    if (videoSrc2) arr.push(videoSrc2);
    return Array.from(new Set(arr.filter(Boolean).map(String)));
  }, [videos, videoSrc, videoSrc2]);

  /* ---------- prefetch videos to blobs (no mid-session revoke) ---------- */
  const [videoBlobMap, setVideoBlobMap] = useState({});
  const objectUrlsRef = useRef([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const updates = {};
      for (const src of videoList) {
        if (!src || videoBlobMap[src]) continue;
        try {
          const resp = await fetch(src);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          objectUrlsRef.current.push(url);
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

    const revokeAll = () => {
      objectUrlsRef.current.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
      objectUrlsRef.current = [];
    };
    window.addEventListener('pagehide', revokeAll);
    window.addEventListener('beforeunload', revokeAll);
    return () => {
      window.removeEventListener('pagehide', revokeAll);
      window.removeEventListener('beforeunload', revokeAll);
      // NOTE: do NOT revoke here; dev HMR would break blob URLs.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoList, debug]);

  /* ---------- build final slides: images then videos ---------- */
  const slides = useMemo(() => {
    const arr = [...imageSlides];
    for (const src of videoList) {
      const blob = videoBlobMap[src];
      arr.push({
        type: 'video',
        src: blob || src,  // current source for the <video>
        direct: src,       // original URL for fallback
      });
    }
    return arr;
  }, [imageSlides, videoList, videoBlobMap]);

  const hasSlides = slides.length > 0;

  /* ---------- index + blackout transitions ---------- */
  const [index, setIndex] = useState(0);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timerRef = useRef(null);
  const swapOutRef = useRef(null);
  const waitFadeInRef = useRef(null); // when waiting for video canplay
  const videoRefs = useRef({});       // index -> <video>
  const pendingFadeRef = useRef(false);

  // start index (clamped)
  useEffect(() => {
    if (startAtIndex == null) return;
    if (!hasSlides) return;
    const n = slides.length;
    let idx = Math.floor(Number(startAtIndex));
    if (!isFinite(idx)) idx = 0;
    if (idx < 0) idx = 0;
    if (idx >= n) idx = n - 1;
    setIndex(idx);
  }, [startAtIndex, hasSlides, slides.length]);

  // clamp on slides change
  useEffect(() => {
    if (!hasSlides) { if (index !== 0) setIndex(0); return; }
    const max = slides.length - 1;
    if (index > max) setIndex(max);
    if (index < 0) setIndex(0);
  }, [slides.length, hasSlides, index]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (swapOutRef.current) clearTimeout(swapOutRef.current);
      if (waitFadeInRef.current) clearTimeout(waitFadeInRef.current);
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const blackoutSwitch = useCallback((toIndex) => {
    if (isTransitioning || !slides.length) return;
    setIsTransitioning(true);
    setIsBlackout(true);
    swapOutRef.current = setTimeout(() => {
      setIndex(toIndex);
      requestAnimationFrame(() => {
        const next = slides[toIndex];
        // If next is a video, wait for canplay before fading in (prevents poster flash)
        if (next?.type === 'video') {
          pendingFadeRef.current = true;
          // Safety fallback: if canplay never fires, unblack after 2s
          if (waitFadeInRef.current) clearTimeout(waitFadeInRef.current);
          waitFadeInRef.current = setTimeout(() => {
            if (pendingFadeRef.current) {
              pendingFadeRef.current = false;
              setIsBlackout(false);
              setTimeout(() => setIsTransitioning(false), fade);
            }
          }, Math.max(1500, holdBlack));
        } else {
          // Normal image: short hold, then fade in
          setTimeout(() => {
            setIsBlackout(false);
            setTimeout(() => setIsTransitioning(false), fade);
          }, Math.max(0, holdBlack));
        }
      });
    }, fade);
  }, [slides, isTransitioning, fade, holdBlack]);

  const goToNext = useCallback(() => {
    if (!slides.length) return;
    const next = (index + 1) % slides.length;
    blackoutSwitch(next);
  }, [index, slides.length, blackoutSwitch]);

  const scheduleImageAdvance = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(goToNext, dwell);
  }, [goToNext, dwell, clearTimer]);

  // auto-advance images only
  useEffect(() => {
    clearTimer();
    if (!hasSlides || isTransitioning) return;
    const current = slides[index];
    if (!current || current.type === 'video') return;
    scheduleImageAdvance();
    return clearTimer;
  }, [index, slides, hasSlides, scheduleImageAdvance, clearTimer, isTransitioning]);

  /* ---------- activate video when its slide becomes current ---------- */
  useEffect(() => {
    const current = slides[index];
    if (!current || current.type !== 'video') return;
    const v = videoRefs.current[index];
    if (!v) return;

    // Pause any other video
    Object.keys(videoRefs.current).forEach(k => {
      const i = Number(k);
      if (i !== index) {
        const other = videoRefs.current[i];
        try { other && other.pause && other.pause(); } catch {}
      }
    });

    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';

    const chosen = current.src || current.direct;
    if (v.src !== chosen) {
      v.src = chosen;           // only set if changed to avoid restarts
      try { v.load(); } catch {}
    }

    const playPromise = v.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        if (debug) console.warn('[ImageSlider] autoplay blocked; user gesture may be required');
      });
    }

    const onCanPlay = () => {
      if (pendingFadeRef.current) {
        pendingFadeRef.current = false;
        if (waitFadeInRef.current) { clearTimeout(waitFadeInRef.current); waitFadeInRef.current = null; }
        setTimeout(() => {
          setIsBlackout(false);
          setTimeout(() => setIsTransitioning(false), fade);
        }, Math.max(0, holdBlack));
      }
    };

    const onEnded = () => goToNext();

    const onError = () => {
      // If blob fails (dev/HMR edge), try direct URL once
      if (v.src.startsWith('blob:') && current.direct) {
        if (debug) console.warn('[ImageSlider] blob failed, retrying direct:', current.direct);
        v.src = current.direct;
        try { v.load(); v.play(); } catch {}
        return;
      }
      if (debug) console.warn('[ImageSlider] video error -> skipping');
      goToNext();
    };

    v.addEventListener('canplay', onCanPlay, { once: true });
    v.addEventListener('ended', onEnded);
    v.addEventListener('error', onError);
    return () => {
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('error', onError);
      // 'canplay' was once:true
    };
  }, [index, slides, debug, goToNext, fade, holdBlack]);

  /* ---------- render ---------- */
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
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minHeight,
        height: height !== undefined ? height : undefined,
      }}
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
          transition: 'none', // swap happens under blackout
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
              // NOTE: no poster -> prevents "first image" flash; we fade in after 'canplay'
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
          transition: `opacity ${fade}ms ease`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
