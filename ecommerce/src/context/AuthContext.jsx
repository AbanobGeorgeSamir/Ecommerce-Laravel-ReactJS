import { useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { clearStoredAuth, fetchAuthenticatedUser, getStoredToken } from '../api/axios';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const freshUser = await fetchAuthenticatedUser();
    localStorage.setItem('user', JSON.stringify(freshUser));
    setUser(freshUser);
    return freshUser;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        await refreshUser();
      } catch (error) {
        console.error('Failed to initialize auth state', error);
        clearStoredAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData, token) => {
    localStorage.setItem('token', token);

    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }

    try {
      return await refreshUser();
    } catch (error) {
      console.error('Failed to fetch authenticated user', error);
      return userData;
    }
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAdmin: !!user?.is_admin
      }}>

      {children}
    </AuthContext.Provider>);

};
