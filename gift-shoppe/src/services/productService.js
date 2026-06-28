import { collection, getDocs } from 'firebase/firestore';
import { featuredProducts, shopByItemProducts } from '../data/products';
import { enrichProduct } from '../utils/productHelpers';
import { getFirestoreDb } from './firebaseApp';

const staticCatalog = [...featuredProducts, ...shopByItemProducts].map(enrichProduct);

function mapFirestoreDoc(doc) {
  const data = doc.data();
  return enrichProduct({
    id: doc.id,
    name: data.name,
    price: data.price,
    image: data.image,
    category: data.category,
    description: data.description,
    slug: data.slug,
  });
}

async function fetchFromFirestore() {
  const db = getFirestoreDb();
  if (!db) {
    return null;
  }

  const snapshot = await getDocs(collection(db, 'products'));
  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs.map(mapFirestoreDoc);
}

export async function getAllProducts() {
  try {
    const remote = await fetchFromFirestore();
    if (remote && remote.length > 0) {
      return remote;
    }
  } catch (error) {
    console.warn('Firestore products unavailable, using static catalog.', error);
  }
  return staticCatalog;
}

export async function getProductBySlug(slug) {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id) {
  const products = await getAllProducts();
  return products.find((p) => p.id === id) || null;
}

export async function getProductsByCategory(category) {
  const products = await getAllProducts();
  if (category === 'All') {
    return products;
  }
  return products.filter((p) => p.category === category);
}

export async function getRelatedProducts(product, limit = 4) {
  const products = await getAllProducts();
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
