import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'chatly.user';

export function AuthProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(STORAGE_KEY);
  });
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    api
      .getUsers()
      .then((data) => {
        if (!active) return;
        setUsers(data);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback((userId) => {
    setCurrentUserId(userId);
    window.localStorage.setItem(STORAGE_KEY, userId);
  }, []);

  const logout = useCallback(() => {
    setCurrentUserId(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => {
    const currentUser = users.find((u) => u.id === currentUserId) || null;
    return { currentUser, users, status, login, logout };
  }, [users, currentUserId, status, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
