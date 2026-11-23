import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auspify_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('auspify_token') || null);
  const [loading, setLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('auspify_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out');
          logout();
        }
      }
      setInitialCheckDone(true);
    };

    verifyUser();
  }, [token]);

  const saveAuthSession = (authData) => {
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('auspify_token', authData.token);
    localStorage.setItem('auspify_user', JSON.stringify(authData));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        saveAuthSession(res.data);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, preferredCurrency) => {
    setLoading(true);
    try {
      const res = await api.register({ name, email, password, preferredCurrency });
      if (res.success && res.data) {
        saveAuthSession(res.data);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      const res = await api.demoLogin();
      if (res.success && res.data) {
        saveAuthSession(res.data);
        return { success: true };
      }
      return { success: false, message: res.message || 'Demo login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Demo login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auspify_token');
    localStorage.removeItem('auspify_user');
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.updateProfile(data);
      if (res.success && res.data) {
        const updated = { ...user, ...res.data };
        setUser(updated);
        localStorage.setItem('auspify_user', JSON.stringify(updated));
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const seedSampleData = async () => {
    try {
      const res = await api.seedData();
      return res;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        initialCheckDone,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        seedSampleData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
