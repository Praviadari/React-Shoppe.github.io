import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { getFirestoreDb } from './firebaseApp';

const WISHLIST_STORAGE_KEY = 'giftshoppe-wishlist';

export function toWishlistItem(product) {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    addedAt: new Date().toISOString(),
  };
}

export function loadLocalWishlist() {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveLocalWishlist(items) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

export function clearLocalWishlist() {
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
}

export async function fetchUserWishlist(userId) {
  const db = getFirestoreDb();
  if (!db || !userId) {
    return loadLocalWishlist();
  }

  const snapshot = await getDocs(collection(db, 'users', userId, 'wishlist'));
  return snapshot.docs.map((item) => item.data());
}

export async function saveWishlistItemRemote(userId, item) {
  const db = getFirestoreDb();
  if (!db || !userId) {
    return;
  }
  await setDoc(doc(db, 'users', userId, 'wishlist', String(item.productId)), item);
}

export async function removeWishlistItemRemote(userId, productId) {
  const db = getFirestoreDb();
  if (!db || !userId) {
    return;
  }
  await deleteDoc(doc(db, 'users', userId, 'wishlist', String(productId)));
}

export async function syncLocalWishlistToRemote(userId, items) {
  if (!userId || items.length === 0) {
    return;
  }
  await Promise.all(items.map((item) => saveWishlistItemRemote(userId, item)));
}
