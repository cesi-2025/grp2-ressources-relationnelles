'use client';
 
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { auth, tokenStorage, User, ApiError } from '@/lib/api';
 
interface AuthState {
  user: User | null;
  loading: boolean;
}
 
interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isSuperAdmin: boolean;
}
 
const AuthContext = createContext<AuthContextValue | null>(null);
 
function getRedirectPath(role: User['role']): string {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return '/administration';
    case 'moderateur':
      return '/moderation';
    default:
      return '/dashboard';
  }
}
 
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
 
  // Restore session on mount
  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) {
      setState({ user: null, loading: false });
      return;
    }
    auth.me()
      .then((user) => setState({ user, loading: false }))
      .catch(() => {
        tokenStorage.remove();
        setState({ user: null, loading: false });
      });
  }, []);
 
  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await auth.login({ email, password });
    tokenStorage.set(token);
    setState({ user, loading: false });
    router.push(getRedirectPath(user.role));
  }, [router]);
 
  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    const { token, user } = await auth.register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    tokenStorage.set(token);
    setState({ user, loading: false });
    router.push(getRedirectPath(user.role));
  }, [router]);
 
  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } finally {
      tokenStorage.remove();
      setState({ user: null, loading: false });
      router.push('/auth/connexion');
    }
  }, [router]);
 
  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin' || state.user?.role === 'super_admin',
    isModerator: ['moderateur', 'admin', 'super_admin'].includes(state.user?.role ?? ''),
    isSuperAdmin: state.user?.role === 'super_admin',
  };
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
 
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
 
// Convenience hook — redirects to login if not authenticated
export function useRequireAuth(): AuthContextValue {
  const auth = useAuth();
  const router = useRouter();
 
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      router.replace('/auth/connexion');
    }
  }, [auth.loading, auth.isAuthenticated, router]);
 
  return auth;
}