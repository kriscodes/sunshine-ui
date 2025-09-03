import React, { useMemo } from 'react';
import './index.css';

/** Extract a YouTube ID from many URL shapes (watch, shorts, youtu.be, embed) */
function extractYouTubeId(input = '') {
  // if dev passes just the 11-char ID, accept it
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return { id: input, isShort: false };

  const str = String(input);
  const patterns = [
    { re: /youtu\.be\/([a-zA-Z0-9_-]{11})/i, short: false },
    { re: /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/i, short: false },
    { re: /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i, short: false },
    { re: /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i, short: true },
  ];

  for (const { re, short } of patterns) {
    const m = str.match(re);
    if (m && m[1]) return { id: m[1], isShort: short || /\/shorts\//i.test(str) };
  }

  // Fallback: last-resort 11-char token in the string
  const m = str.match(/([a-zA-Z0-9_-]{11})/);
  return m ? { id: m[1], isShort: /\/shorts\//i.test(str) } : { id: '', isShort: false };
}

/**
 * YouTubeEmbed
 *
 * Props:
 * - url (string): any YouTube link or 11-char ID
 * - title (string): iframe title for a11y (default provided)
 * - aspect (string): CSS aspect-ratio; "auto" picks 9/16 for shorts, 16/9 otherwise
 * - maxWidth (string): max width of the player container (CSS length)
 * - className (string)
 */
export default function YouTubeEmbed({
  url,
  title = 'Featured video',
  aspect = 'auto',
  maxWidth, // optional
  className = '',
}) {
  const parsed = useMemo(() => extractYouTubeId(url), [url]);
  const computedAspect = aspect === 'auto'
    ? (parsed.isShort ? '9 / 16' : '16 / 9')
    : aspect;

  // Tasteful defaults: narrower max width for Shorts, wider for standard videos
  const computedMaxWidth = useMemo(() => {
    if (maxWidth) return maxWidth;
    return parsed.isShort
      ? 'min(100%, 560px)'   // portrait feels better a bit narrower
      : 'min(100%, 960px)'; // standard player width
  }, [maxWidth, parsed.isShort]);

  if (!parsed.id) return null;

  // Privacy-enhanced mode + tidy params
  const src = `https://www.youtube-nocookie.com/embed/${parsed.id}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <section
      className={`ytEmbed ${className}`}
      aria-label="Video"
    >
      <div
        className="ytEmbed__frame"
        style={{ '--yt-aspect': computedAspect, '--yt-maxw': computedMaxWidth }}
      >
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {/* Optional fallback link for users who block iframes */}
      <noscript>
        <p>
          Watch on YouTube: <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
        </p>
      </noscript>
    </section>
  );
}
