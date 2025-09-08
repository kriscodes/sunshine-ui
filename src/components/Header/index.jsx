import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import './index.css';

/**
 * Header – Responsive, wider layout, larger corner image, improved mobile menu.
 *
 * Props (all optional):
 *  - logoSrc: string (brand mark on left)        default: '/logo.svg'
 *  - cornerGraphicSrc: string (decor in corner)  default: '/images/header-corner.png'
 *  - nav: { label: string, to: string }[]        default: sensible pages
 *
 * Notes:
 *  - If your logo/corner asset paths differ, just pass props from where you render <Header />.
 *  - “Wider” content via max-width: 1400px. Tweak in CSS var --header-max-w if you like.
 */
export default function Header({
  logoSrc = '/logo.svg',
  cornerGraphicSrc = '/images/header-corner.png',
  nav = [
    { label: 'Home', to: '/' },
    { label: 'Programs', to: '/programs' },
    { label: 'Locations', to: '/locations' }
  ],
}) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Body scroll lock when drawer is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = original || '';
    return () => { document.body.style.overflow = original || ''; };
  }, [open]);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close if window grows beyond desktop breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)');
    const onChange = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const Link = RouterLink || 'a';

  return (
    <header className={`siteHeader ${scrolled ? 'siteHeader--scrolled' : ''}`}>
      {/* Decorative corner image (bigger, responsive) */}
      <img
        className="siteHeader__corner"
        src={cornerGraphicSrc}
        alt=""
        aria-hidden="true"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />

      {/* gradient background layer */}
      <div className="siteHeader__bg" aria-hidden="true" />

      <div className="siteHeader__inner">
        {/* Left: Brand */}
        <Link to="/" className="siteHeader__brand" aria-label="Sunshine Preschool – Home">
          <img
            className="siteHeader__logo"
            src={logoSrc}
            alt="Sunshine Preschool"
            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
          />
          <span className="siteHeader__brandText">Sunshine Preschool</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="siteHeader__nav" aria-label="Primary">
          <ul className="siteHeader__navList">
            {nav.map((item) => (
              <li key={item.to} className="siteHeader__navItem">
                <Link
                  to={item.to}
                  className={`siteHeader__link ${location.pathname === item.to ? 'is-active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger */}
        <button
          type="button"
          className={`siteHeader__hamburger ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="siteHeaderDrawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="siteHeader__hamburgerBar" />
          <span className="siteHeader__hamburgerBar" />
          <span className="siteHeader__hamburgerBar" />
        </button>
      </div>

      {/* Scrim + Drawer (mobile/tablet) */}
      <div
        className={`siteHeader__scrim ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div
        id="siteHeaderDrawer"
        className={`siteHeader__drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <ul className="siteHeader__drawerList">
          {nav.map((item) => (
            <li key={item.to} className="siteHeader__drawerItem">
              <Link
                to={item.to}
                className={`siteHeader__drawerLink ${location.pathname === item.to ? 'is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
