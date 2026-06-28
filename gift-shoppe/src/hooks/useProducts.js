import { useCallback, useEffect, useState } from 'react';
import { getAllProducts } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError(null);

    return getAllProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadProducts().then(() => {
      if (cancelled) {
        return;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadProducts]);

  const reload = useCallback(() => loadProducts(), [loadProducts]);

  return { products, loading, error, reload };
}
