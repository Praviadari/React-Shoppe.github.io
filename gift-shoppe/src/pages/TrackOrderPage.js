import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { getOrderById } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import { formatDeliveryDate } from '../utils/deliveryDate';
import '../styles/content-page.css';

function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setOrderId(id);
      setOrder(getOrderById(id));
      setSearched(true);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;

    setSearched(true);
    setOrder(getOrderById(trimmed));
    navigate(`/track-order?id=${encodeURIComponent(trimmed)}`, { replace: true });
  };

  return (
    <div className="content-page">
      <SeoHead
        title="Track Order"
        description="Track your GiftShoppe order by reference number."
        path="/track-order"
        noindex
      />
      <p className="content-page__eyebrow">Orders</p>
      <h1>Track your order</h1>
      <p className="content-page__lead">
        Enter the order reference from your confirmation email or receipt page.
      </p>

      <form className="track-form" onSubmit={handleSubmit}>
        <label>
          Order reference
          <input
            type="text"
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              setSearched(false);
            }}
            placeholder="ORD-..."
            required
          />
        </label>
        <button type="submit">Track order</button>
      </form>

      {searched && order && (
        <div className="track-result" role="status">
          <span className="track-result__status">{order.status}</span>
          <h2>{order.id}</h2>
          <p className="track-result__meta">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
            {' · '}{order.items.length} item{order.items.length === 1 ? '' : 's'}
            {' · '}{formatPrice(order.total)}
          </p>
          {order.scheduledDeliveryDate && (
            <p className="track-result__meta">
              Scheduled delivery: {formatDeliveryDate(order.scheduledDeliveryDate)}
            </p>
          )}
          {order.paymentStatus === 'paid' && order.paymentId && (
            <p className="track-result__meta">Payment confirmed · {order.paymentId}</p>
          )}
          <div className="content-page__actions">
            <Link to={`/order/${order.id}`} className="hero-button">View confirmation</Link>
          </div>
        </div>
      )}

      {searched && !order && (
        <p className="track-result__error" role="alert">
          No order found with that reference. Check the ID and try again, or{' '}
          <Link to="/contact">contact support</Link>.
        </p>
      )}
    </div>
  );
}

export default TrackOrderPage;
