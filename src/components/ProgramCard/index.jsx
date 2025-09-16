import React from 'react';
import './index.css';

/**
 * ProgramCard – tilted media box + diagonal title band (matches the reference)
 *
 * Props:
 *  - title        (string, required)
 *  - subtitle     (string, optional)
 *  - imgSrc       (string, required)
 *  - imgAlt       (string, optional)
 *  - theme        ('green' | 'sand' | 'sage')  default 'green'
 *  - tiltDeg      (number) clockwise tilt of the media box; default 12
 */
export default function ProgramCard({
  title,
  subtitle,
  imgSrc,
  imgAlt,
  theme = 'green',
  tiltDeg = -12, // clear, visible tilt (clockwise) like your screenshot
}) {
  return (
    <article className={`kcCard kcCard--${theme}`}>
      {/* Top header with diagonal bottom edge */}
      <div className="kcCard__head">
        <h3 className="kcCard__title">{title}</h3>
        {subtitle && <p className="kcCard__subtitle">{subtitle}</p>}
      </div>

      {/* Media wrapper: we rotate THIS box, not the image */}
      <div className="kcCard__media">
        <div
          className="kcCard__tilt"
          style={{ '--tilt': `${tiltDeg}deg` }}
        >
          <img
            className="kcCard__img"
            src={imgSrc}
            alt={imgAlt || title}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </article>
  );
}
