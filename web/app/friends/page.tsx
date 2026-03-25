'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import {
  getFriends, getFriendRequests, searchFriends,
  sendFriendRequest, respondFriendReq, removeFriend,
} from '@/lib/api';

type Tab = 'friends' | 'requests' | 'search';

function Avatar({ name, xp, size = 40 }: { name: string; xp?: number; size?: number }) {
  const LEAGUE_COLOR =
    (xp ?? 0) >= 10000 ? '#7c3aed' :
    (xp ?? 0) >= 5000  ? '#42a5f5' :
    (xp ?? 0) >= 2000  ? '#f5c518' :
    (xp ?? 0) >= 1000  ? '#9e9e9e' : '#cd7f32';

  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.35),
      background: `linear-gradient(135deg, ${LEAGUE_COLOR}, ${LEAGUE_COLOR}cc)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 900, color: 'white', flexShrink: 0,
    }}>
      {(name ?? '?').slice(0, 2).toUpperCase()}
    </div>
  );
}

function XPBadge({ xp }: { xp: number }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>
      {xp.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af' }}>XP</span>
    </div>
  );
}

/* ─── Friends tab ─────────────────────────────────────────────────────────── */
function FriendsList({ meId }: { meId?: string }) {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getFriends().then(data => {
      setFriends(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRemove = async (friendshipId: string) => {
    await removeFriend(friendshipId).catch(() => {});
    load();
  };

  if (loading) return <Loader />;
  if (friends.length === 0) return (
    <EmptyState icon="👥" text="Tu n'as pas encore d'amis." sub="Utilise l'onglet Rechercher pour en ajouter !" />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {friends.map((f: any) => {
        const friend = f.fromId === meId ? f.to : f.from;
        const name = friend?.name ?? friend?.email?.split('@')[0] ?? 'Anonyme';
        const xp = friend?.xp ?? 0;
        return (
          <div key={f.id} style={{
            background: 'white', borderRadius: 18, padding: '14px 16px',
            border: '2px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <Avatar name={name} xp={xp} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{name}</div>
              <XPBadge xp={xp} />
            </div>
            <button onClick={() => handleRemove(f.id)} style={{
              padding: '7px 14px', borderRadius: 10, border: '1.5px solid #fca5a5',
              background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              Retirer
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Requests tab ─────────────────────────────────────────────────────────── */
function RequestsList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getFriendRequests().then(data => {
      setRequests(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRespond = async (id: string, accept: boolean) => {
    await respondFriendReq(id, accept).catch(() => {});
    load();
  };

  if (loading) return <Loader />;
  if (requests.length === 0) return (
    <EmptyState icon="📭" text="Aucune demande en attente." sub="Quand quelqu'un t'envoie une demande, elle apparaît ici." />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {requests.map((r: any) => {
        const name = r.from?.name ?? r.from?.email?.split('@')[0] ?? 'Anonyme';
        const xp = r.from?.xp ?? 0;
        return (
          <div key={r.id} style={{
            background: 'white', borderRadius: 18, padding: '14px 16px',
            border: '2px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <Avatar name={name} xp={xp} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{r.from?.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleRespond(r.id, true)} style={{
                flex: 1, padding: '10px', borderRadius: 12, border: 'none',
                background: '#111827', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer',
              }}>
                ✓ Accepter
              </button>
              <button onClick={() => handleRespond(r.id, false)} style={{
                flex: 1, padding: '10px', borderRadius: 12,
                border: '1.5px solid #e5e7eb', background: 'white',
                color: '#6b7280', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                ✗ Refuser
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Search tab ─────────────────────────────────────────────────────────── */
function SearchFriends() {
  const [query,    setQuery]   = useState('');
  const [results,  setResults] = useState<any[]>([]);
  const [sent,     setSent]    = useState<Set<string>>(new Set());
  const [loading,  setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchFriends(query.trim());
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(handleSearch, 400);
    return () => clearTimeout(t);
  }, [query, handleSearch]);

  const handleAdd = async (email: string, userId: string) => {
    setFeedback(null);
    try {
      await sendFriendRequest(email);
      setSent(prev => new Set(prev).add(userId));
      setFeedback('Demande envoyée !');
    } catch (e: any) {
      setFeedback(e?.message?.includes('400') ? 'Demande déjà envoyée.' : 'Erreur, réessaie.');
    }
  };

  return (
    <div>
      {/* Search input */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 16,
        background: 'white', borderRadius: 16, padding: '4px 4px 4px 16px',
        border: '2px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Nom ou adresse e-mail…"
          style={{
            flex: 1, border: 'none', outline: 'none', fontSize: 14,
            fontWeight: 600, color: '#111827', background: 'transparent',
          }}
        />
        <button onClick={handleSearch} style={{
          padding: '10px 18px', borderRadius: 12, border: 'none',
          background: '#111827', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer',
        }}>
          🔍
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '10px 16px', borderRadius: 12, marginBottom: 12,
          background: feedback.includes('envoyée') ? '#f0fdf4' : '#fef2f2',
          border: `1.5px solid ${feedback.includes('envoyée') ? '#86efac' : '#fca5a5'}`,
          color: feedback.includes('envoyée') ? '#16a34a' : '#dc2626',
          fontSize: 13, fontWeight: 700,
        }}>
          {feedback}
        </div>
      )}

      {loading && <Loader />}

      {!loading && query.trim() && results.length === 0 && (
        <EmptyState icon="🔍" text="Aucun résultat." sub="Vérifie le nom ou l'adresse e-mail." />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results.map((u: any) => {
          const name = u.name ?? u.email?.split('@')[0] ?? 'Anonyme';
          const isSent = sent.has(u.id);
          return (
            <div key={u.id} style={{
              background: 'white', borderRadius: 18, padding: '14px 16px',
              border: '2px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <Avatar name={name} xp={u.xp ?? 0} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{u.email}</div>
              </div>
              <button
                disabled={isSent || u.isFriend}
                onClick={() => handleAdd(u.email, u.id)}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: 'none',
                  background: isSent || u.isFriend ? '#f3f4f6' : '#111827',
                  color: isSent || u.isFriend ? '#9ca3af' : 'white',
                  fontSize: 12, fontWeight: 800, cursor: isSent || u.isFriend ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {u.isFriend ? 'Ami ✓' : isSent ? 'Envoyé ✓' : '+ Ajouter'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function Loader() {
  return <div style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>Chargement…</div>;
}

function EmptyState({ icon, text, sub }: { icon: string; text: string; sub: string }) {
  return (
    <div style={{ padding: '40px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#374151', marginBottom: 4 }}>{text}</div>
      <div style={{ fontSize: 13, color: '#9ca3af' }}>{sub}</div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
const TABS: { key: Tab; label: string }[] = [
  { key: 'friends',  label: '👥 Mes amis'  },
  { key: 'requests', label: '📨 Demandes'  },
  { key: 'search',   label: '🔍 Rechercher' },
];

export default function FriendsPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>('friends');

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>

      {/* Header */}
      <div style={{ padding: '32px 0 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 4 }}>Amis</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Apprends avec tes amis et grimpe ensemble dans les ligues !
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: '10px 6px', borderRadius: 14,
            fontWeight: 800, fontSize: 12, cursor: 'pointer', border: 'none',
            background: tab === key ? '#111827' : '#f3f4f6',
            color: tab === key ? 'white' : '#6b7280',
            transition: 'all 0.15s',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'friends'  && <FriendsList meId={user?.id} />}
      {tab === 'requests' && <RequestsList />}
      {tab === 'search'   && <SearchFriends />}
    </div>
  );
}
