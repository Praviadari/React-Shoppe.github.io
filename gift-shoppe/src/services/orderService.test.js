import { createOrder, getOrderById, getOrders } from './orderService';

jest.mock('./firebaseApp', () => ({
  getFirestoreDb: () => null,
}));

const ORDERS_STORAGE_KEY = 'giftshoppe-orders';

const sampleCustomer = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '9876543210',
  address: '1 Computing Lane',
  city: 'London',
  pincode: '560001',
};

describe('orderService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('createOrder persists locally and applies shipping for small orders', async () => {
    const order = await createOrder({
      items: [{ id: 'f1', name: 'Infinity Photo Frame', price: 500, quantity: 1 }],
      customer: sampleCustomer,
    });

    expect(order.subtotal).toBe(500);
    expect(order.shipping).toBe(99);
    expect(order.total).toBe(599);
    expect(getOrderById(order.id)).toEqual(order);
  });

  it('createOrder waives shipping for orders at or above ₹2000', async () => {
    const order = await createOrder({
      items: [{ id: 'bundle', name: 'Premium Bundle', price: 2000, quantity: 1 }],
      customer: sampleCustomer,
    });

    expect(order.shipping).toBe(0);
    expect(order.total).toBe(2000);
  });

  it('getOrders returns newest order first', async () => {
    const first = await createOrder({
      items: [{ id: 'a', name: 'Item A', price: 100, quantity: 1 }],
      customer: sampleCustomer,
    });
    const second = await createOrder({
      items: [{ id: 'b', name: 'Item B', price: 200, quantity: 1 }],
      customer: sampleCustomer,
    });

    const orders = getOrders();
    expect(orders[0].id).toBe(second.id);
    expect(orders[1].id).toBe(first.id);
    expect(localStorage.getItem(ORDERS_STORAGE_KEY)).toBeTruthy();
  });
});
