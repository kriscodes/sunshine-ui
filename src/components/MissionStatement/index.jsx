import React from 'react';
import './index.css';

export default function MissionStatement({
  title = 'Our Mission',
  text = "Sunshine is dedicated to meeting the individual needs of children and families, fostering a sense of pride in self and community, as it upholds best practices in the field of Early Care and Education, centered on the whole-child approach to learning. Establishing and maintaining secure connections with the children in our care, teaches them that they are part of a caring community that will continue to watch them grow with love. Sunshine is committed to providing an inclusive, and welcoming environment for all members of our staff, children, families, volunteers, subcontractors, and vendors.",
  imageSrc,
  imageAlt = 'Sunshine Preschool',
  highlightPills = [],
  align = 'right',
}) {
  const paragraphs = Array.isArray(text) ? text : [text];
  const hasImage = Boolean(imageSrc);
  const sideClass = align === 'left' ? 'mission__inner--left' : 'mission__inner--right';

  return (
    <section className="mission" aria-labelledby="mission-title">
      
      <div className="mission__bg" aria-hidden="true" />
      <div className={`mission__inner ${hasImage ? 'mission__inner--split' : ''} ${sideClass}`}>
        <div className="mission__copy">
          <h2 id="mission-title" className="mission__title">
            <span className="mission__accent" aria-hidden />
            {title}
          </h2>

          <div className="mission__text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {!!highlightPills?.length && (
            <ul className="mission__highlights" aria-label="Highlights">
              {highlightPills.map((h, i) => (
                <li key={i} className="mission__pill">{h}</li>
              ))}
            </ul>
          )}
        </div>

        {hasImage && (
          <div className="mission__media">
            <img className="mission__img" src={imageSrc} alt={imageAlt} loading="lazy" />
          </div>
        )}
      </div>
    </section>
  );
}
