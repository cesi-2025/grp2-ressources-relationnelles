import {
  apiDeleteAccount,
  apiLogin,
  apiLogout,
  apiMe,
  apiRegister,
  type ApiUser,
} from "@/lib/authApi";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/tokenStorage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  isReady: boolean;
  isLoggedIn: boolean;
  token: string | null;
  user: ApiUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const stored = await getStoredToken();
        if (cancelled) return;
        if (!stored) return;
        const me = await apiMe(stored);
        if (cancelled) return;
        setToken(stored);
        setUser(me);
      } catch {
        await clearStoredToken();
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    await setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiRegister(name, email, password);
    await setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const signOut = useCallback(async () => {
    const t = token;
    if (t) {
      try {
        await apiLogout(t);
      } catch {}
    }
    await clearStoredToken();
    setToken(null);
    setUser(null);
  }, [token]);

  const deleteAccount = useCallback(async () => {
    const t = token;
    if (!t) return;
    await apiDeleteAccount(t);
    await clearStoredToken();
    setToken(null);
    setUser(null);
  }, [token]);

  const refreshUser = useCallback(async () => {
    const t = token;
    if (!t) return;
    const me = await apiMe(t);
    setUser(me);
  }, [token]);

  const value = useMemo(
    () => ({
      isReady,
      isLoggedIn: Boolean(token),
      token,
      user,
      signIn,
      signUp,
      signOut,
      deleteAccount,
      refreshUser,
    }),
    [isReady, token, user, signIn, signUp, signOut, deleteAccount, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return ctx;
}
