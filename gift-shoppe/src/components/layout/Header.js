import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './Header.css';

function navClass({ isActive }) {
  return `nav-link${isActive ? ' active' : ''}`;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);
  const { subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();

  useFocusTrap(isMenuOpen, navRef);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const accountPath = user ? '/account' : '/login';
  const accountLabel = user ? 'Your account' : 'Sign in';

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
          <span className="header-top-link header-top-link--static">
            INR (₹)
          </span>
        </div>
      </div>

      {isMenuOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <div className="header-main">
        <Link to="/" className="header-brand" onClick={closeMenu}>
          <span className="header-brand-text">GiftShoppe</span>
        </Link>

        <button
          ref={hamburgerRef}
          type="button"
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="material-icons" aria-hidden="true">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>

        <nav
          id="primary-navigation"
          ref={navRef}
          className={`header-nav ${isMenuOpen ? 'active' : ''}`}
        >
          <NavLink to="/" end className={navClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/shop" className={navClass} onClick={closeMenu}>Shop</NavLink>
          <NavLink to="/build" className={navClass} onClick={closeMenu}>Custom Gifts</NavLink>
          <NavLink to="/collections" className={navClass} onClick={closeMenu}>Collections</NavLink>
          <NavLink to="/about" className={navClass} onClick={closeMenu}>About</NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/search" className="action-icon action-icon--desktop-only" aria-label="Search">
            <span className="material-icons" aria-hidden="true">search</span>
          </Link>
          <Link to={accountPath} className="action-icon action-icon--desktop-only" aria-label={accountLabel}>
            <span className="material-icons" aria-hidden="true">{user ? 'person' : 'person_outline'}</span>
          </Link>
          <Link to="/wishlist" className="action-icon" aria-label={`Wishlist, ${wishlistCount} items`}>
            <span className="material-icons" aria-hidden="true">
              {wishlistCount > 0 ? 'favorite' : 'favorite_border'}
            </span>
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </Link>
          <div className="cart-container">
            <Link to="/cart" className="action-icon" aria-label={`Shopping bag, ${itemCount} items`}>
              <span className="material-icons" aria-hidden="true">shopping_bag</span>
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
            <span className="cart-total" aria-live="polite">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
