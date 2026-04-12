import { apiUrl } from "@/lib/api";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active?: boolean;
};

export type LoginResponse = {
  token: string;
  token_type: string;
  user: ApiUser;
};

const fetchDefaults: Pick<RequestInit, "credentials"> = {
  credentials: "omit",
};

const jsonHeaders: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

function bearerHeaders(token: string): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function parseApiErrorBody(data: unknown, status: number): string {
  if (typeof data !== "object" || data === null) {
    return `Erreur ${status}`;
  }
  const d = data as Record<string, unknown>;
  if ("errors" in d && typeof d.errors === "object" && d.errors !== null) {
    const first = Object.values(d.errors as Record<string, string[]>).flat()[0];
    if (first) return first;
  }
  if (typeof d.message === "string") return d.message;
  return `Erreur ${status}`;
}

const LOGIN_MSG_MAP: Record<string, string> = {
  "Invalid credentials.": "E-mail ou mot de passe incorrect.",
  "The given data was invalid.": "Données invalides.",
  "User account is disabled.": "Ce compte est désactivé.",
};

const API_CRYPTO_HINTS: Record<string, string> = {
  "The MAC is invalid.":
    "Cookies ou clé Laravel invalides (APP_KEY / données du site pour l’URL de l’API).",
};

const REGISTER_MSG_MAP: Record<string, string> = {
  "The email has already been taken.": "Cet e-mail est déjà utilisé.",
  "The email hash has already been taken.": "Cet e-mail est déjà utilisé.",
};

function humanizeLoginMessage(msg: string): string {
  return LOGIN_MSG_MAP[msg] ?? API_CRYPTO_HINTS[msg] ?? msg;
}

function humanizeRegisterMessage(msg: string): string {
  return REGISTER_MSG_MAP[msg] ?? API_CRYPTO_HINTS[msg] ?? msg;
}

async function parseJsonResponse(res: Response): Promise<unknown> {
  const raw = await res.text();
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  let res: Response;
  try {
    res = await fetch(apiUrl("/api/login"), {
      ...fetchDefaults,
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });
  } catch {
    throw new Error(
      "Impossible de joindre le serveur. Vérifie EXPO_PUBLIC_API_URL et le réseau.",
    );
  }

  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(humanizeLoginMessage(parseApiErrorBody(data, res.status)));
  }
  return data as LoginResponse;
}

export async function apiLogout(token: string): Promise<void> {
  await fetch(apiUrl("/api/logout"), {
    ...fetchDefaults,
    method: "POST",
    headers: bearerHeaders(token),
  });
}

export async function apiDeleteAccount(token: string): Promise<void> {
  const res = await fetch(apiUrl("/api/user"), {
    ...fetchDefaults,
    method: "DELETE",
    headers: bearerHeaders(token),
  });
  if (!res.ok) {
    throw new Error("Suppression du compte impossible.");
  }
}

export async function apiRegister(
  name: string,
  email: string,
  password: string,
): Promise<LoginResponse> {
  let res: Response;
  try {
    res = await fetch(apiUrl("/api/register"), {
      ...fetchDefaults,
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        password_confirmation: password,
      }),
    });
  } catch {
    throw new Error("Impossible de joindre le serveur.");
  }

  const data = await parseJsonResponse(res);
  if (!res.ok) {
    const raw = parseApiErrorBody(data, res.status);
    throw new Error(humanizeRegisterMessage(raw));
  }
  return data as LoginResponse;
}

export async function apiMe(token: string): Promise<ApiUser> {
  const res = await fetch(apiUrl("/api/user"), {
    ...fetchDefaults,
    headers: bearerHeaders(token),
  });
  if (!res.ok) throw new Error("Session invalide");
  return res.json() as Promise<ApiUser>;
}
