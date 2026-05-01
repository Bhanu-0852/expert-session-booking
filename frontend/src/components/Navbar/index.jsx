import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          EXPERT<span className="logo-accent">BOOKING</span>
        </Link>

        {/* Desktop & Mobile Menu */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMenu}>
              Find Experts
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/bookings" className="nav-links" onClick={closeMenu}>
              My Bookings
            </Link>
          </li>
        </ul>

        {/* Hamburger Toggle */}
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`bar ${isMobileMenuOpen ? 'bar1-active' : ''}`}></div>
          <div className={`bar ${isMobileMenuOpen ? 'bar2-active' : ''}`}></div>
          <div className={`bar ${isMobileMenuOpen ? 'bar3-active' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;