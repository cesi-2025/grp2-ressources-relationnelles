'use client';
 
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { auth, tokenStorage, User } from '@/lib/api';
import { authCookies } from '@/lib/cookies';
 
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
    case 'moderator':
      return '/administration';
    default:
      return '/dashboard';
  }
}
 
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
 
  useEffect(() => {
    let cancelled = false;
    const token = tokenStorage.get();
    if (!token) {
      setState({ user: null, loading: false });
      return;
    }

    if (state.user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    // récupération des information d'auth 
    auth.me()
      .then((user) => {
        if (!cancelled) {
          authCookies.set(token, user.role); // création d'un cookies avec nos information
          setState({ user, loading: false }); // récupération de l'état d'auht
        }
      })
      .catch(() => {
        tokenStorage.remove();
        authCookies.remove();
        if (!cancelled) setState({ user: null, loading: false });
      });
    return () => { cancelled = true; };
  }, [state.user]);
 
  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await auth.login({ email, password });
    tokenStorage.set(token);
    authCookies.set(token, user.role); // recupération et stockage du token avec auth
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
    authCookies.set(token, user.role); //  recupération et stockage du token avec auth
    setState({ user, loading: false });
    router.push(getRedirectPath(user.role));
  }, [router]);
 
  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } finally {
      tokenStorage.remove();
      authCookies.remove(); // suppresion du cookies
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
    isModerator: state.user?.role === 'moderator',
    isSuperAdmin: state.user?.role === 'super_admin',
  };
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
 
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
 
export function useRequireAuth(): AuthContextValue {
  const authCtx = useAuth();
  const router = useRouter();
 
  useEffect(() => {
    if (!authCtx.loading && !authCtx.isAuthenticated) {
      router.replace('/auth/connexion');
    }
  }, [authCtx.loading, authCtx.isAuthenticated, router]);
 
  return authCtx;
}
 
export function useRequireAdmin(): AuthContextValue {
  const authCtx = useAuth();
  const router = useRouter();
 
  useEffect(() => {
    if (!authCtx.loading && !authCtx.isAdmin && !authCtx.isModerator) {
      router.replace('/dashboard');
    }
  }, [authCtx.loading, authCtx.isAdmin, authCtx.isModerator, router]);
 
  return authCtx;
}

export function useRequireStrictAdmin(): AuthContextValue {
  const authCtx = useAuth();
  const router = useRouter();
 
  useEffect(() => {
    if (!authCtx.loading && !authCtx.isAdmin) {
      router.replace('/dashboard');
    }
  }, [authCtx.loading, authCtx.isAdmin, router]);
 
  return authCtx;
}

export function useRequireSuperAdmin(): AuthContextValue {
  const authCtx = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authCtx.loading && !authCtx.isSuperAdmin) {
      router.replace('/administration');
    }
  }, [authCtx.loading, authCtx.isSuperAdmin, router]);

  return authCtx;
}