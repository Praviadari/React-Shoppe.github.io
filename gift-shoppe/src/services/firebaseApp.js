import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig, { isFirebaseConfigured } from './firebase';

let app = null;
let auth = null;
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

export function getAuthInstance() {
  if (!getFirebaseApp()) {
    return null;
  }
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
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
