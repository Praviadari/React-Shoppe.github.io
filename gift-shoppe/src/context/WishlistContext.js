import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  clearLocalWishlist,
  fetchUserWishlist,
  loadLocalWishlist,
  removeWishlistItemRemote,
  saveLocalWishlist,
  saveWishlistItemRemote,
  syncLocalWishlistToRemote,
  toWishlistItem,
} from '../services/wishlistService';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(loadLocalWishlist);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      setLoading(true);
      try {
        if (user) {
          const localItems = loadLocalWishlist();
          if (localItems.length > 0) {
            await syncLocalWishlistToRemote(user.uid, localItems);
            clearLocalWishlist();
          }
          const remoteItems = await fetchUserWishlist(user.uid);
          if (!cancelled) {
            setItems(remoteItems);
          }
        } else if (!cancelled) {
          setItems(loadLocalWishlist());
        }
      } catch (error) {
        console.warn('Wishlist sync failed; using local data.', error);
        if (!cancelled) {
          setItems(loadLocalWishlist());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWishlist();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      saveLocalWishlist(items);
    }
  }, [items, user]);

  const isInWishlist = useCallback(
    (productId) => items.some((item) => item.productId === productId),
    [items]
  );

  const addToWishlist = useCallback(
    async (product) => {
      const item = toWishlistItem(product);
      setItems((prev) => {
        if (prev.some((existing) => existing.productId === item.productId)) {
          return prev;
        }
        return [...prev, item];
      });

      if (user) {
        try {
          await saveWishlistItemRemote(user.uid, item);
        } catch (error) {
          console.warn('Could not save wishlist item remotely.', error);
        }
      }
    },
    [user]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      setItems((prev) => prev.filter((item) => item.productId !== productId));

      if (user) {
        try {
          await removeWishlistItemRemote(user.uid, productId);
        } catch (error) {
          console.warn('Could not remove wishlist item remotely.', error);
        }
      }
    },
    [user]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        return false;
      }
      await addToWishlist(product);
      return true;
    },
    [addToWishlist, isInWishlist, removeFromWishlist]
  );

  const itemCount = items.length;

  const value = useMemo(
    () => ({
      items,
      itemCount,
      loading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }),
    [items, itemCount, loading, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
