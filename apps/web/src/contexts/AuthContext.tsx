'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { apiCall } from '@/data/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charge le token depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        setToken(savedToken);
        // Optionnel: vérifier que le token est encore valide
        refreshUser(savedToken);
      }
    } catch (error) {
      console.error('Failed to load token from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(
    async (tokenToUse?: string) => {
      const tokenValue = tokenToUse || token;
      if (!tokenValue) {
        setLoading(false);
        return;
      }

      try {
        const userData = await apiCall<User>('/user', { token: tokenValue });
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user:', error);
        // Token invalide ou expiré
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await apiCall<{
          token: string;
          token_type: string;
          user: User;
        }>('/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        const { token: newToken, user: userData } = response;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('auth_token', newToken);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    []
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirmation: string
    ) => {
      try {
        const response = await apiCall<{
          token: string;
          token_type: string;
          user: User;
        }>('/register', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        });

        const { token: newToken, user: userData } = response;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('auth_token', newToken);
      } catch (error) {
        console.error('Register failed:', error);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      if (token) {
        await apiCall('/logout', {
          method: 'POST',
          token,
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continuer même si l'API échoue
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshUser: () => refreshUser(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
