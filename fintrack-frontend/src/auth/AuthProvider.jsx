import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

/*
AuthContext exposes:

user: Firebase user or null
loading: boolean while auth state initializes or an auth op runs
loginWithGoogle(): popup Google sign-in
loginWithEmail(email, password): email/password sign-in
registerWithEmail(email, password): email/password sign-up
logout(): sign out
*/

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // unified loading state
  const [pending, setPending] = useState(false); // ongoing operation state

  // Subscribe to auth state once
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Auth actions with error handling
  const loginWithGoogle = async () => {
    setPending(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setPending(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setPending(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    } finally {
      setPending(false);
    }
  };

  const registerWithEmail = async (email, password) => {
    setPending(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setPending(false);
    }
  };

  const logout = async () => {
    setPending(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setPending(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading: loading || pending,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      logout,
    }),
    [user, loading, pending]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/*
Notes:
- Unified `loading` replaces the old `initializing` flag for clarity.
- `loading` handles the first auth state check, while `pending` covers ongoing actions.
- Each auth function throws an error for UI components (like Login.jsx) to catch and display messages.
*/
