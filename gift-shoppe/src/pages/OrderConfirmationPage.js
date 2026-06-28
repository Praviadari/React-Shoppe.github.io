import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { getOrderById } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import './OrderConfirmationPage.css';

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="order-confirmation order-confirmation--missing">
        <h1>Order not found</h1>
        <p>We could not find an order with that reference.</p>
        <Link to="/shop">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <SeoHead title="Order confirmed" path={`/order/${orderId}`} noindex />
      <div className="order-confirmation__card" role="status">
        <p className="order-confirmation__eyebrow">Order confirmed</p>
        <h1>Thank you, {order.customer.fullName.split(' ')[0]}!</h1>
        <p className="order-confirmation__id">Order reference: <strong>{order.id}</strong></p>
        <p className="order-confirmation__message">
          Your gift order totalling {formatPrice(order.total)} has been received.
          A confirmation will be sent to {order.customer.email}.
        </p>

        <div className="order-confirmation__summary">
          <h2>Items</h2>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="order-confirmation__total">
            <span>Total paid</span>
            <span>{formatPrice(order.total)}</span>
          </p>
        </div>

        <div className="order-confirmation__actions">
          <Link to="/track-order" className="order-confirmation__btn">Track order</Link>
          <Link to="/shop" className="order-confirmation__btn order-confirmation__btn--secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
