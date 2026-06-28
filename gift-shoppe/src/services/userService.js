import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirestoreDb } from './firebaseApp';

export async function createUserProfile(userId, { email, displayName }) {
  const db = getFirestoreDb();
  if (!db) {
    return null;
  }

  const profile = {
    email,
    displayName: displayName || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', userId), profile);
  return profile;
}

export async function getUserProfile(userId) {
  const db = getFirestoreDb();
  if (!db || !userId) {
    return null;
  }

  const snapshot = await getDoc(doc(db, 'users', userId));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function updateUserProfile(userId, updates) {
  const db = getFirestoreDb();
  if (!db || !userId) {
    throw new Error('Profile updates require Firebase.');
  }

  await updateDoc(doc(db, 'users', userId), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}
