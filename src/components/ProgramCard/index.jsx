import React from 'react';
import './index.css';

export default function ProgramCard({
  title,
  subtitle,
  imgSrc,
  imgAlt,
  theme = 'green',
  tiltDeg = -12, 
}) {
  return (
    <article className={`kcCard kcCard--${theme}`}>
      <div className="kcCard__head">
        <h3 className="kcCard__title">{title}</h3>
        {subtitle && <p className="kcCard__subtitle">{subtitle}</p>}
      </div>

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
