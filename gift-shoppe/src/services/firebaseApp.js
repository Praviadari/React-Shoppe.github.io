import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig, { isFirebaseConfigured } from './firebase';

let app = null;
let auth = null;
let db = null;
let functions = null;

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

export function getFunctionsInstance() {
  if (!getFirebaseApp()) {
    return null;
  }
  if (!functions) {
    functions = getFunctions(getFirebaseApp(), process.env.REACT_APP_FUNCTIONS_REGION || 'asia-south1');
    if (
      process.env.NODE_ENV === 'development'
      && process.env.REACT_APP_FUNCTIONS_EMULATOR === 'true'
    ) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
  }
  return functions;
}
