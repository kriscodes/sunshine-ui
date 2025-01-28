import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css'; 
import '../../variables.css'

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/sunshine_logo.png" alt="Logo" />
      </div>
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/locations">Locations</Link>
        <Link to="/programs">Programs</Link>
      </nav>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </header>
  );
};

export default Header;










