import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { items, subtotal, itemCount, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1>Your bag</h1>
        <p className="cart-page__empty-message">Your bag is empty — discover something special.</p>
        <Link to="/shop" className="cart-page__cta">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
      <div className="cart-page__layout">
        <ul className="cart-page__items">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              {item.image && (
                <img src={item.image} alt="" className="cart-item__image" />
              )}
              <div className="cart-item__details">
                <h2 className="cart-item__name">{item.name}</h2>
                {item.type === 'custom' && item.metadata?.engraving && (
                  <p className="cart-item__meta">Engraving: {item.metadata.engraving}</p>
                )}
                {item.type === 'custom' && item.metadata?.material && (
                  <p className="cart-item__meta">Material: {item.metadata.material}</p>
                )}
                <p className="cart-item__price">₹{item.price}</p>
                <div className="cart-item__actions">
                  <label className="cart-item__qty-label">
                    Qty
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                      className="cart-item__qty-input"
                    />
                  </label>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="cart-item__line-total">₹{item.price * item.quantity}</p>
            </li>
          ))}
        </ul>
        <aside className="cart-page__summary">
          <h2>Order summary</h2>
          <p className="cart-page__subtotal">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </p>
          <p className="cart-page__note">Shipping and taxes calculated at checkout.</p>
          <Link to="/checkout" className="cart-page__checkout-btn">
            Proceed to checkout
          </Link>
          <Link to="/shop" className="cart-page__continue">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
