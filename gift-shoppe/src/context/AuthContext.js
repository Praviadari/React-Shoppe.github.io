import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isAuthAvailable, signIn, signOut, signUp, subscribeToAuth } from '../services/authService';
import { getUserProfile } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          setProfile(userProfile);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return null;
    }
    const userProfile = await getUserProfile(user.uid);
    setProfile(userProfile);
    return userProfile;
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthAvailable: isAuthAvailable(),
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [user, profile, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
