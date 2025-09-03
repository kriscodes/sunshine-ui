import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

/**
 * ImageSlider (LePort-style hero)
 *
 * Props:
 * - images: Array<string | { src: string; alt?: string }>
 * - interval?: number (ms)        default 7000
 * - fadeDuration?: number (ms)    default 600
 * - holdBlack?: number (ms)       default 220
 * - height?: string               default 'clamp(420px, 65vh, 860px)'
 * - contentAlign?: 'left' | 'center' | 'right'   default 'left'
 * - autoplay?: boolean            default true
 * - className?: string
 * - style?: React.CSSProperties
 * - children?: ReactNode          overlay content (headline, buttons, etc.)
 *
 * Notes:
 * - No video support on purpose (as requested).
 * - Respects prefers-reduced-motion.
 * - Pauses when offscreen or tab is hidden; resumes automatically.
 */

const ImageSlider = ({
  images = [],
  interval = 7000,
  fadeDuration = 600,
  holdBlack = 220,
  height = 'clamp(420px, 65vh, 860px)',
  contentAlign = 'left',
  autoplay = true,
  className = '',
  style,
  children
}) => {
  const slides = useMemo(
    () =>
      (images || []).map((i) =>
        typeof i === 'string' ? { src: i, alt: '' } : { src: i.src, alt: i.alt || '' }
      ),
    [images]
  );

  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [prefersReducedMotion, setPRM] = useState(false);

  const containerRef = useRef(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mql = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const update = () => setPRM(!!mql?.matches);
    update();
    mql?.addEventListener?.('change', update);
    mql?.addListener?.(update); // Safari fallback
    return () => {
      mql?.removeEventListener?.('change', update);
      mql?.removeListener?.(update);
    };
  }, []);

  // Pause autoplay when the slider is offscreen
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1 });
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  // Pause autoplay when the tab is hidden
  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Helpers
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const preload = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
      if (img.complete) resolve(true);
    });

    const changeSlide = useCallback(
    async (nextIndex) => {
      if (!slides.length) return;
      setIsFading(true);                     // start fade to black
      await wait(fadeDuration);              // time to reach full black
      const len = slides.length;
      const safeNext = ((nextIndex % len) + len) % len;
      await preload(slides[safeNext].src);   // load while screen is black (prevents flash)
      setIndex(safeNext);                    // swap image under black
      await wait(holdBlack);                 // hold black briefly
      setIsFading(false);                    // reveal new image
    },
    [fadeDuration, holdBlack, slides]
  );

  const next = useCallback(() => changeSlide(indexRef.current + 1), [changeSlide]);
  const prev = useCallback(() => changeSlide(indexRef.current - 1), [changeSlide]);

  // Autoplay loop
  useEffect(() => {
    if (!autoplay || prefersReducedMotion || slides.length <= 1) return;
    if (!isVisible || !tabVisible) return;

    let cancelled = false;
    let timer = setTimeout(tick, interval);

    async function tick() {
      if (cancelled) return;
      if (isHovered) {
        timer = setTimeout(tick, 500);
        return;
      }
      await changeSlide(indexRef.current + 1);
      timer = setTimeout(tick, interval);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [autoplay, prefersReducedMotion, slides.length, isVisible, tabVisible, isHovered, interval, changeSlide]);

  if (!slides.length) return null;
  

  return (
    <section
      ref={containerRef}
      className={`su-imageSlider ${className}`}
      style={{
        '--su-slider-height': height,
        '--su-fade-ms': `${fadeDuration}ms`,
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Image Slider"
    >
      {/* Slides (full-bleed) */}
      <div className="su-slides" aria-hidden="true">
        {slides.map((s, i) => (
          <img
            key={`${s.src}-${i}`}
            className={`su-slide ${i === index ? 'is-active' : ''}`}
            src={s.src}
            alt={s.alt}
            draggable="false"
          />
        ))}
      </div>

      {/* Gentle readability shade */}
      <div className="su-shade" aria-hidden="true" />

      {/* Fade-to-black overlay */}
      <div className={`su-blackout ${isFading ? 'is-visible' : ''}`} aria-hidden="true" />

      {/* Overlay content (see-through/glass) */}
      <div className={`su-contentWrap align-${contentAlign}`}>
        <div className="su-content su-glass">
          {children}
        </div>
      </div>

      {/* Optional nav arrows */}
      {slides.length > 1 && (
        <>
          <button className="su-nav su-nav--prev" aria-label="Previous slide" onClick={prev}>‹</button>
          <button className="su-nav su-nav--next" aria-label="Next slide" onClick={next}>›</button>
        </>
      )}
    </section>
  );
};

export default ImageSlider;