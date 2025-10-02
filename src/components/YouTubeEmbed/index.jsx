import React, { useMemo } from 'react';
import './index.css';

function extractYouTubeId(input = '') {
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

  const m = str.match(/([a-zA-Z0-9_-]{11})/);
  return m ? { id: m[1], isShort: /\/shorts\//i.test(str) } : { id: '', isShort: false };
}

export default function YouTubeEmbed({
  url,
  title = 'Featured video',
  aspect = 'auto',
  maxWidth, 
  className = '',
}) {
  const parsed = useMemo(() => extractYouTubeId(url), [url]);
  const computedAspect = aspect === 'auto'
    ? (parsed.isShort ? '9 / 16' : '16 / 9')
    : aspect;

  const computedMaxWidth = useMemo(() => {
    if (maxWidth) return maxWidth;
    return parsed.isShort
      ? 'min(100%, 560px)'   
      : 'min(100%, 960px)'; 
  }, [maxWidth, parsed.isShort]);

  if (!parsed.id) return null;

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

      <noscript>
        <p>
          Watch on YouTube: <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
        </p>
      </noscript>
    </section>
  );
}
