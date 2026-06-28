import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

function navClass({ isActive }) {
  return `nav-link${isActive ? ' active' : ''}`;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { subtotal, itemCount } = useCart();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header-container">
      <div className="header-top">
        <div className="header-top-links">
          <Link to="/track-order" className="header-top-link">
            <span className="material-icons" aria-hidden="true" style={{ fontSize: '14px' }}>local_shipping</span>
            Track Order
          </Link>
          <Link to="/support" className="header-top-link">
            <span className="material-icons" aria-hidden="true" style={{ fontSize: '14px' }}>support_agent</span>
            24/7 Support
          </Link>
          <div className="header-top-link">
            INR (₹) <span className="material-icons" aria-hidden="true" style={{ fontSize: '14px' }}>expand_more</span>
          </div>
        </div>
      </div>

      <div className="header-main">
        <Link to="/" className="header-brand" onClick={closeMenu}>
          <span className="header-brand-text">GiftShoppe</span>
        </Link>

        <button
          type="button"
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="material-icons" aria-hidden="true">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>

        <nav id="primary-navigation" className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" end className={navClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/shop" className={navClass} onClick={closeMenu}>Shop</NavLink>
          <NavLink to="/build" className={navClass} onClick={closeMenu}>Custom Gifts</NavLink>
          <NavLink to="/collections" className={navClass} onClick={closeMenu}>Collections</NavLink>
          <NavLink to="/about" className={navClass} onClick={closeMenu}>About</NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/search" className="action-icon" aria-label="Search">
            <span className="material-icons" aria-hidden="true">search</span>
          </Link>
          <Link to="/account" className="action-icon" aria-label="Account">
            <span className="material-icons" aria-hidden="true">person_outline</span>
          </Link>
          <Link to="/wishlist" className="action-icon" aria-label="Wishlist">
            <span className="material-icons" aria-hidden="true">favorite_border</span>
          </Link>
          <div className="cart-container">
            <Link to="/cart" className="action-icon" aria-label={`Shopping bag, ${itemCount} items`}>
              <span className="material-icons" aria-hidden="true">shopping_bag</span>
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
            <span className="cart-total">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
