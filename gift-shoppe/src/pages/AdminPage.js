import React, { useMemo } from 'react';
import SeoHead from '../components/seo/SeoHead';
import { getInquiries } from '../services/inquiryService';
import { getOrders } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import { formatDeliveryDate } from '../utils/deliveryDate';
import './AdminPage.css';

function AdminPage() {
  const orders = useMemo(() => getOrders(), []);
  const inquiries = useMemo(() => getInquiries(), []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const conciergeCount = inquiries.filter((item) => item.type === 'concierge').length;
  const corporateCount = inquiries.filter((item) => item.type === 'corporate').length;

  return (
    <div className="admin-page">
      <SeoHead title="Admin dashboard" path="/admin" noindex />
      <h1>Admin dashboard</h1>
      <p className="admin-page__subtitle">Orders and premium service requests stored on this device.</p>

      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat__label">Orders</p>
          <p className="admin-stat__value">{orders.length}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Revenue</p>
          <p className="admin-stat__value">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Concierge</p>
          <p className="admin-stat__value">{conciergeCount}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Corporate</p>
          <p className="admin-stat__value">{corporateCount}</p>
        </div>
      </div>

      <section className="admin-section" aria-labelledby="admin-orders-heading">
        <h2 id="admin-orders-heading">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="admin-empty">No orders yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer.fullName}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      {order.scheduledDeliveryDate
                        ? formatDeliveryDate(order.scheduledDeliveryDate)
                        : 'Standard'}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--confirmed">{order.status}</span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section" aria-labelledby="admin-inquiries-heading">
        <h2 id="admin-inquiries-heading">Service inquiries</h2>
        {inquiries.length === 0 ? (
          <p className="admin-empty">No concierge or corporate inquiries yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Summary</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>{inquiry.id}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${inquiry.type}`}>
                        {inquiry.type}
                      </span>
                    </td>
                    <td>
                      {inquiry.type === 'corporate'
                        ? inquiry.payload.contactName
                        : inquiry.payload.fullName}
                      <br />
                      <small>{inquiry.payload.email}</small>
                    </td>
                    <td>
                      {inquiry.type === 'corporate'
                        ? `${inquiry.payload.companyName} · ${inquiry.payload.quantity}`
                        : `${inquiry.payload.occasion}${inquiry.payload.budget ? ` · ${inquiry.payload.budget}` : ''}`}
                    </td>
                    <td>{new Date(inquiry.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminPage;
