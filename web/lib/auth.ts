const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'darija_token';
const USER_KEY  = 'darija_user';

export interface AuthUser {
  id:    string;
  email: string;
  name?: string | null;
}

export interface AuthResponse {
  token: string;
  user:  AuthUser;
}

/* ── HTTP helper ── */
async function post(path: string, body: object): Promise<AuthResponse> {
  const res = await fetch(`${API}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    // NestJS retourne { message: string | string[] }
    const msg = Array.isArray(data.message) ? data.message[0] : (data.message ?? 'Erreur serveur');
    throw new Error(msg);
  }
  return data as AuthResponse;
}

/* ── API calls ── */
export async function apiRegister(
  email: string,
  password: string,
  name?: string,
): Promise<AuthResponse> {
  return post('/auth/register', { email, password, ...(name ? { name } : {}) });
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return post('/auth/login', { email, password });
}

/* ── Storage ── */
export function storeAuth(res: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem(USER_KEY,  JSON.stringify(res.user));
  // Cookie lu par le middleware Next.js pour la protection des routes
  document.cookie = `jwt=${res.token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict`;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = 'jwt=; path=/; max-age=0';
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
