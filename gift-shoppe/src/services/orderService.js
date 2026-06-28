import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
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

function sortOrdersNewestFirst(orders) {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createOrder({
  items,
  customer,
  giftMessage,
  scheduledDeliveryDate = null,
  userId = null,
}) {
  const orderId = generateOrderId();
  const subtotal = computeOrderTotal(items);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const order = {
    id: orderId,
    items,
    customer,
    giftMessage: giftMessage || '',
    scheduledDeliveryDate: scheduledDeliveryDate || null,
    subtotal,
    shipping,
    total,
    status: 'confirmed',
    userId,
    createdAt: new Date().toISOString(),
  };

  const db = getFirestoreDb();
  if (db && userId) {
    try {
      await addDoc(collection(db, 'orders'), order);
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

export async function getOrdersForUser(userId) {
  const localOrders = loadLocalOrders().filter((order) => order.userId === userId);
  const db = getFirestoreDb();

  if (!db || !userId) {
    return sortOrdersNewestFirst(localOrders);
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, 'orders'), where('userId', '==', userId))
    );
    const remoteOrders = snapshot.docs.map((docSnap) => docSnap.data());
    const merged = new Map();

    [...localOrders, ...remoteOrders].forEach((order) => {
      merged.set(order.id, order);
    });

    return sortOrdersNewestFirst([...merged.values()]);
  } catch (error) {
    console.warn('Could not load orders from Firestore; using local orders.', error);
    return sortOrdersNewestFirst(localOrders);
  }
}
