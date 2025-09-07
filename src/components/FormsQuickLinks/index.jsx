import React from 'react';
import './index.css';

/**
 * FormsQuickLinks – two-button PDF download block
 *
 * Props:
 *  - englishHref (string)   required
 *  - spanishHref (string)   required
 *  - englishLabel (string)  default: 'Enrollment Form (English)'
 *  - spanishLabel (string)  default: 'Formulario de Inscripción (Español)'
 *  - englishFileName (string) optional
 *  - spanishFileName (string) optional
 *  - heading (string)       default: 'Enrollment Forms'
 *  - subheading (string)    default: 'Download the form in your preferred language.'
 *  - className (string)     optional
 */
export default function FormsQuickLinks({
  englishHref,
  spanishHref,
  englishLabel = 'Enrollment Form (English)',
  spanishLabel = 'Formulario de Inscripción (Español)',
  englishFileName,
  spanishFileName,
  heading = 'Enrollment Forms',
  subheading = 'Download the form in your preferred language.',
  className = '',
}) {
  return (
    <section className={`formsQ ${className}`}>
      <div className="formsQ-card" role="region" aria-label="Enrollment Forms">
        <header className="formsQ-header">
          <h2 className="formsQ-title">{heading}</h2>
          {subheading && <p className="formsQ-subtitle">{subheading}</p>}
        </header>

        <div className="formsQ-actions">
          <a
            className="formsQ-btn"
            href={englishHref}
            download={englishFileName || undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${englishLabel} (PDF) – opens in a new tab`}
          >
            <DownloadIcon /> {englishLabel}
          </a>

          <a
            className="formsQ-btn"
            href={spanishHref}
            download={spanishFileName || undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${spanishLabel} (PDF) – opens in a new tab`}
          >
            <DownloadIcon /> {spanishLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{ marginRight: 8, flex: '0 0 auto' }}
    >
      <path d="M12 3v12m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
