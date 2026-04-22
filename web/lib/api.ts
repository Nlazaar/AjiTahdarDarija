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
    throw err;
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      // Effacer le token invalide pour éviter une boucle de redirection
      localStorage.removeItem('darija_token');
      localStorage.removeItem('darija_user');
      document.cookie = 'jwt=; path=/; max-age=0';
      // Ne rediriger que si on n'est pas déjà sur une page d'auth
      const p = window.location.pathname;
      if (!p.startsWith('/login') && !p.startsWith('/register') && p !== '/') {
        window.location.href = '/login';
      }
    }
    return {} as T;
  }

  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(`API ${res.status}: ${text}`);
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export type Track = {
  id: string;
  code: 'DARIJA' | 'MSA' | 'RELIGION';
  name: string;
  nameAr?: string | null;
  description?: string | null;
  emoji?: string | null;
  color?: string | null;
  order: number;
  isPublished: boolean;
};

export const getModules            = (track?: string)   => request<Module[]>(track ? `/modules?track=${encodeURIComponent(track)}` : '/modules');
export const getTracks             = ()                 => request<Track[]>('/tracks');
export const getLessonsByModule    = (moduleId: string) => request<Lesson[]>(`/modules/${moduleId}/lessons`);
export const getLesson             = (lessonId: string) => request<Lesson>(`/lessons/${lessonId}`);
export const getExercises          = (lessonId: string) => request<Exercise[]>(`/lessons/${lessonId}/exercises`);
export const getVocabularyByLesson = (lessonId: string) => request<any[]>(`/lessons/${lessonId}/vocabulary`);
export const getDailyVocab         = (track?: string)   => request<{ id: string; word: string; transliteration: string | null; translation: any; audioUrl: string | null } | null>(
  track ? `/vocabulary/daily?track=${encodeURIComponent(track)}` : `/vocabulary/daily`
);
export const getAuthoredExercises  = (lessonId: string) => request<any[]>(`/lessons/${lessonId}/authored-exercises`);
export const getGamification       = ()                 => request<Gamification>('/gamification/me');
export const getProfile            = ()                 => request<any>('/auth/me');
export const updateProfile         = (data: { avatar?: string; name?: string }) => request<any>('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
export const getMyProgress         = ()                 => request<any>('/progress/me');
export const completeLessonApi     = (lessonId: string) => request<any>(`/progress/complete/${lessonId}`, { method: 'POST' });
export const getMyJourney          = (track?: string)   => request<{
  currentCityKey: string | null
  visitedCityKeys: string[]
  route: { moduleId: string; moduleSlug: string; canonicalOrder: number; cityKey: string }[]
}>(track ? `/progress/journey?track=${encodeURIComponent(track)}` : '/progress/journey');

// Leaderboard
export const getLeaderboard        = ()                 => request<any[]>('/leaderboard/global');
export const getWeeklyLeaderboard  = ()                 => request<any[]>('/leaderboard/weekly');
export const getFriendsLeaderboard = ()                 => request<any[]>('/leaderboard/friends');
export const getMyRank             = ()                 => request<{ rank: number | null; xp: number }>('/leaderboard/my-rank');

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

// Cultural collection
export const getCulturalItems   = (category?: string) => request<any[]>(category ? `/cultural?category=${encodeURIComponent(category)}` : '/cultural');
export const getMyCultural      = ()            => request<any[]>('/cultural/mine');
export const unlockCulturalItem = (key: string) => request<any>(`/cultural/unlock/${key}`, { method: 'POST' });

// Duels
export const createDuel   = (body: { lessonId?: string; rounds?: number } = {}) =>
  request<any>('/duels', { method: 'POST', body: JSON.stringify(body) });
export const listOpenDuels = () => request<any[]>('/duels/open');
export const listMyDuels   = () => request<any[]>('/duels/mine');
export const getDuel       = (id: string) => request<any>(`/duels/${id}`);
export const joinDuel      = (id: string) => request<any>(`/duels/${id}/join`, { method: 'POST' });
export const submitDuelRound = (id: string, body: { score: number; correct: boolean }) =>
  request<any>(`/duels/${id}/round`, { method: 'POST', body: JSON.stringify(body) });
export const cancelDuel    = (id: string) => request<any>(`/duels/${id}/cancel`, { method: 'POST' });

// Quests
export const getQuestState   = ()            => request<any>('/quests');
export const claimQuestReward = (key: string) => request<any>(`/quests/claim/${key}`, { method: 'POST' });

// Rétention / révision (SRS)
export const markVocabSeen   = (vocabularyId: string) =>
  request<any>('/user-vocabulary/seen', { method: 'POST', body: JSON.stringify({ vocabularyId }) });
export const markVocabResult = (vocabularyId: string, correct: boolean) =>
  request<any>(`/user-vocabulary/${vocabularyId}/result`, { method: 'POST', body: JSON.stringify({ correct }) });
export const getDueVocab     = (limit = 20) => request<any[]>(`/user-vocabulary/due?limit=${limit}`);
export const getRetentionStats = () => request<{ total: number; mastered: number; learning: number; toReview: number; dueNow: number }>('/user-vocabulary/stats');
