import React from 'react';
import './index.css';

// Public asset paths (served from site root)
const LOGO_SRC = '/sunshine_logo.png';
const IG_ICON  = '/instagram.png';
const TT_ICON  = '/tiktok.png';

// Social links
const IG_HREF = 'https://www.instagram.com/sunshine_preschool2';
const TT_HREF = 'https://www.tiktok.com/@sunshine_preschool1';

export default function Footer({
  className = '',
  privacyHref = '/privacy-policy',
  termsHref = '/terms-of-use',
  copyright = '© 2025 Sunshine Preschool. All rights reserved.',
}) {
  return (
    <footer className={`siteFooter ${className}`}>
      {/* Gradient layer */}
      <div className="siteFooter__bg" aria-hidden="true" />

      <div className="siteFooter__inner">
        {/* Row 1: Logo (centered) */}
        <div className="siteFooter__brand">
          <a href="/" aria-label="Sunshine Preschool — Home" className="siteFooter__brandLink">
            <img
              className="siteFooter__logo"
              src={LOGO_SRC}
              alt="Sunshine Preschool"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
            />
          </a>
        </div>

        {/* Row 2: Social icons (centered) */}
        <ul className="siteFooter__socialList">
          <li className="siteFooter__socialItem">
            <a
              href={IG_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="siteFooter__socialLink"
              aria-label="Instagram"
              title="Instagram"
            >
              <img src={IG_ICON} alt="Instagram" className="siteFooter__socialIcon" />
            </a>
          </li>
          <li className="siteFooter__socialItem">
            <a
              href={TT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="siteFooter__socialLink"
              aria-label="TikTok"
              title="TikTok"
            >
              <img src={TT_ICON} alt="TikTok" className="siteFooter__socialIcon" />
            </a>
          </li>
        </ul>

        {/* Row 3: Campuses (addresses & phones) */}
        <div className="siteFooter__campuses" aria-label="Campuses">
          <div className="siteFooter__campus">
            <span className="footer-title">Sunshine Preschool - Lynwood</span>
            <address className="footer-address">
              12070 Santa Fe Ave, <br />
              Lynwood, CA 90262 <br />
              <a href="tel:+13107622558" className="footer-phone">(310) 762-2558</a>
            </address>
          </div>

          <div className="siteFooter__campus">
            <span className="footer-title">Sunshine Preschool - Compton</span>
            <address className="footer-address">
              2038 E Compton Blvd, <br />
              Compton, CA 90221 <br />
              <a href="tel:+14243383053" className="footer-phone">(424) 338-3053</a>
            </address>
          </div>
        </div>
      </div>

      {/* Row 4: Legal bar */}
      <div className="siteFooter__legal">
        <div className="siteFooter__legalInner">
          <div className="siteFooter__legalLinks">
            <a href={privacyHref} className="siteFooter__legalLink">Privacy Policy</a>
            <span className="siteFooter__dot" aria-hidden>•</span>
            <a href={termsHref} className="siteFooter__legalLink">Terms of Use</a>
          </div>
          <div className="siteFooter__copy">{copyright}</div>
        </div>
      </div>
    </footer>
  );
}
