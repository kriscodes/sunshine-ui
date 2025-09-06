import React from 'react';
import programs from '../../data/programs.json'
import './styles.css';

export default function ProgramList() {
  // Lock to exactly 4 items to guarantee a 2x2 grid
  const items = programs.slice(0, 4);

  // If fewer than 4, add invisible placeholders so the grid stays 2x2
  const placeholders = Array.from({ length: Math.max(0, 4 - items.length) }, (_, i) => ({
    __placeholder: true,
    id: `placeholder-${i}`,
  }));

  return (
    <section className="programs-section" aria-labelledby="programs-heading">
      {/* Optional section title (hide if you don't use it) */}
      {/* <h2 id="programs-heading" className="sr-only">Programs</h2> */}

      <ul className="program-list" role="list" aria-label="Programs">
        {[...items, ...placeholders].map((p) =>
          p.__placeholder ? (
            <li key={p.id} className="program-card program-card--ghost" aria-hidden="true" />
          ) : (
            <li key={p.id || p.slug || p.title} className="program-card">
              {/* Uniform image box (same visual size for all images) */}
              <div
                className="program-card__media"
                style={p.objectPosition ? { '--object-position': p.objectPosition } : undefined}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="program-card__body">
                <h3 className="program-card__title">{p.name}</h3>
                <p className="program-card__desc">{p.description}</p>
              </div>
            </li>
          )
        )}
      </ul>
    </section>
  );
}