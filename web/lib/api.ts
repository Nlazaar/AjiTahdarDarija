import { getToken } from '@/lib/auth';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type Module = {
  id: string;
  title: string;
  description?: string;
  progress?: number;
};

export type Lesson = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
};

export type Exercise = {
  id: string;
  type: string;
  question: string;
  options?: string[];
};

export type Badge = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
};

export type Gamification = {
  xp: number;
  streak: number;
  hearts: number;
  gemmes: number;
  badges: Badge[];
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers, cache: 'no-store' });
  } catch (err) {
    console.warn('[api] Network error:', err);
    return {} as T;
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return {} as T;
  }

  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(`API ${res.status}: ${text}`);
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export const getModules            = ()                 => request<Module[]>('/modules');
export const getLessonsByModule    = (moduleId: string) => request<Lesson[]>(`/modules/${moduleId}/lessons`);
export const getLesson             = (lessonId: string) => request<Lesson>(`/lessons/${lessonId}`);
export const getExercises          = (lessonId: string) => request<Exercise[]>(`/lessons/${lessonId}/exercises`);
export const getVocabularyByLesson = (lessonId: string) => request<any[]>(`/lessons/${lessonId}/vocabulary`);
export const getGamification       = ()                 => request<Gamification>('/gamification/me');
export const getProfile            = ()                 => request<any>('/auth/me');
export const getMyProgress         = ()                 => request<any>('/progress/me');
export const completeLessonApi     = (lessonId: string) => request<any>(`/progress/complete/${lessonId}`, { method: 'POST' });

// Leaderboard
export const getLeaderboard        = ()                 => request<any[]>('/leaderboard/global');
export const getWeeklyLeaderboard  = ()                 => request<any[]>('/leaderboard/weekly');
export const getFriendsLeaderboard = ()                 => request<any[]>('/leaderboard/friends');

// Friends
export const getFriends         = ()                 => request<any[]>('/friends');
export const getFriendRequests  = ()                 => request<any[]>('/friends/requests');
export const searchFriends      = (q: string)        => request<any[]>(`/friends/search?q=${encodeURIComponent(q)}`);
export const sendFriendRequest  = (email: string)    => request('/friends/request', { method: 'POST', body: JSON.stringify({ email }) });
export const respondFriendReq   = (id: string, accept: boolean) => request(`/friends/respond/${id}`, { method: 'POST', body: JSON.stringify({ accept }) });
export const removeFriend       = (id: string)       => request(`/friends/${id}`, { method: 'DELETE' });

export const submitLesson = (
  lessonId: string,
  body: { answers: Array<{ exerciseId: string; answer: any }> },
) => request(`/lessons/${lessonId}/submit`, { method: 'POST', body: JSON.stringify(body) });

export const addXp = (amount: number) =>
  request('/gamification/xp', { method: 'POST', body: JSON.stringify({ amount }) });

export const updateStreak = () =>
  request('/gamification/streak', { method: 'POST', body: JSON.stringify({}) });

export const updateHearts = (delta: number) =>
  request('/gamification/hearts', { method: 'POST', body: JSON.stringify({ delta }) });

// Shop
export const getShopItems   = ()             => request<any[]>('/shop');
export const getMyInventory = ()             => request<any[]>('/shop/inventory');
export const buyShopItem    = (key: string)  => request<any>(`/shop/buy/${key}`, { method: 'POST' });

// Quests
export const getQuestState   = ()            => request<any>('/quests');
export const claimQuestReward = (key: string) => request<any>(`/quests/claim/${key}`, { method: 'POST' });
