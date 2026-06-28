import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig, { isFirebaseConfigured } from './firebase';

let app = null;
let db = null;

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
}

export function getFirestoreDb() {
  if (!getFirebaseApp()) {
    return null;
  }
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
