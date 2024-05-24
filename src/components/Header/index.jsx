import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css'; 
import '../../variables.css'

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/path-to-your-logo.png" alt="Logo" />
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/locations">Locations</Link>
        <Link to="/programs">Programs</Link>
        <Link to="/events">Events</Link>
      </nav>
    </header>
  );
};

export default Header;










