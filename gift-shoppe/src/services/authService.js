import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { getAuthInstance } from './firebaseApp';
import { isFirebaseConfigured } from './firebase';
import { createUserProfile, getUserProfile } from './userService';

export function isAuthAvailable() {
  return isFirebaseConfigured() && Boolean(getAuthInstance());
}

export function subscribeToAuth(callback) {
  const auth = getAuthInstance();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signUp({ email, password, displayName }) {
  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Firebase Auth is not configured.');
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  await createUserProfile(credential.user.uid, {
    email,
    displayName: displayName || '',
  });
  return credential.user;
}

export async function signIn({ email, password }) {
  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Firebase Auth is not configured.');
  }
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signInWithGoogle() {
  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Firebase Auth is not configured.');
  }

  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const existingProfile = await getUserProfile(credential.user.uid);

  if (!existingProfile) {
    await createUserProfile(credential.user.uid, {
      email: credential.user.email || '',
      displayName: credential.user.displayName || '',
    });
  }

  return credential.user;
}

export async function signOut() {
  const auth = getAuthInstance();
  if (!auth) {
    return;
  }
  await firebaseSignOut(auth);
}
