import { addDoc, collection } from 'firebase/firestore';
import { getFirestoreDb } from './firebaseApp';

const ORDERS_STORAGE_KEY = 'giftshoppe-orders';

function loadLocalOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function computeOrderTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export async function createOrder({ items, customer, giftMessage }) {
  const orderId = generateOrderId();
  const subtotal = computeOrderTotal(items);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const order = {
    id: orderId,
    items,
    customer,
    giftMessage: giftMessage || '',
    subtotal,
    shipping,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  const db = getFirestoreDb();
  if (db) {
    try {
      await addDoc(collection(db, 'orders'), {
        ...order,
        userId: null,
      });
    } catch (error) {
      console.warn('Could not persist order to Firestore; saved locally.', error);
    }
  }

  const orders = loadLocalOrders();
  orders.unshift(order);
  saveLocalOrders(orders);

  return order;
}

export function getOrderById(orderId) {
  const orders = loadLocalOrders();
  return orders.find((o) => o.id === orderId) || null;
}

export function getOrders() {
  return loadLocalOrders();
}
