import { addDoc, collection } from 'firebase/firestore';
import { getFirestoreDb } from './firebaseApp';

const INQUIRIES_STORAGE_KEY = 'giftshoppe-inquiries';

function loadLocalInquiries() {
  try {
    const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalInquiries(inquiries) {
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
}

function generateInquiryId() {
  return `INQ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function sortNewestFirst(items) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function persistInquiry(inquiry) {
  const inquiries = loadLocalInquiries();
  inquiries.unshift(inquiry);
  saveLocalInquiries(inquiries);

  const db = getFirestoreDb();
  if (!db) return inquiry;

  try {
    await addDoc(collection(db, 'inquiries'), inquiry);
  } catch (error) {
    console.warn('Could not persist inquiry to Firestore; saved locally.', error);
  }

  return inquiry;
}

export async function submitConciergeRequest(payload, userId = null) {
  const inquiry = {
    id: generateInquiryId(),
    type: 'concierge',
    payload,
    userId,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  return persistInquiry(inquiry);
}

export async function submitCorporateInquiry(payload, userId = null) {
  const inquiry = {
    id: generateInquiryId(),
    type: 'corporate',
    payload,
    userId,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  return persistInquiry(inquiry);
}

export async function submitContactMessage(payload, userId = null) {
  const inquiry = {
    id: generateInquiryId(),
    type: 'contact',
    payload,
    userId,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  return persistInquiry(inquiry);
}

export function getInquiries() {
  return sortNewestFirst(loadLocalInquiries());
}

export function getInquiriesByType(type) {
  return getInquiries().filter((inquiry) => inquiry.type === type);
}
