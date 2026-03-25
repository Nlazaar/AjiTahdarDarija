'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getLeaderboard, getFriendsLeaderboard } from '@/lib/api';

const LEAGUE_CONFIG = [
  { min: 0,     name: 'Bronze',  color: '#cd7f32', bg: '#fdf2e4', icon: '🥉' },
  { min: 1000,  name: 'Argent',  color: '#9e9e9e', bg: '#f5f5f5', icon: '🥈' },
  { min: 2000,  name: 'Or',      color: '#f5c518', bg: '#fffde7', icon: '🥇' },
  { min: 5000,  name: 'Diamant', color: '#42a5f5', bg: '#e3f2fd', icon: '💎' },
  { min: 10000, name: 'Master',  color: '#7c3aed', bg: '#f3e8ff', icon: '👑' },
];

function getLeague(xp: number) {
  return [...LEAGUE_CONFIG].reverse().find(l => xp >= l.min) ?? LEAGUE_CONFIG[0];
}

const MOCK_GLOBAL = [
  { id: 'm1', name: 'Amine B.',   xp: 3240, level: 4 },
  { id: 'm2', name: 'Sara K.',    xp: 2950, level: 3 },
  { id: 'm3', name: 'Yassine M.', xp: 2710, level: 3 },
  { id: 'm4', name: 'Leila A.',   xp: 2480, level: 3 },
  { id: 'm5', name: 'Omar T.',    xp: 2100, level: 3 },
  { id: 'm6', name: 'Nadia R.',   xp: 1890, level: 2 },
  { id: 'm7', name: 'Karim D.',   xp: 1750, level: 2 },
  { id: 'm8', name: 'Hind L.',    xp: 1620, level: 2 },
  { id: 'm9', name: 'Mehdi S.',   xp: 1410, level: 2 },
  { id: 'm10', name: 'Rim F.',    xp: 1280, level: 2 },
];

function getRankMedal(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}

function UserRow({ rank, name, xp, level, isMe }: {
  rank: number; name: string; xp: number; level: number; isMe?: boolean;
}) {
  const league = getLeague(xp);
  const medal  = getRankMedal(rank);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 20px',
      background: isMe ? `linear-gradient(90deg, ${league.color}18, ${league.color}08)` : 'white',
      borderBottom: '1.5px solid #f3f4f6',
      borderLeft: isMe ? `4px solid ${league.color}` : '4px solid transparent',
    }}>
      {/* Rank */}
      <div style={{
        width: 32, textAlign: 'center', flexShrink: 0,
        fontSize: medal ? 20 : 14,
        fontWeight: 900,
        color: medal ? undefined : (rank <= 10 ? '#374151' : '#9ca3af'),
      }}>
        {medal ?? rank}
      </div>

      {/* Avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg, ${league.color}, ${league.color}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 900, color: 'white',
        boxShadow: isMe ? `0 2px 8px ${league.color}40` : 'none',
      }}>
        {(name ?? '?').slice(0, 2).toUpperCase()}
      </div>

      {/* Name + league */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: isMe ? 900 : 700, color: '#111827' }}>
          {name ?? 'Anonyme'}{isMe ? ' (moi)' : ''}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: league.color }}>
          {league.icon} {league.name} · Niv.{level}
        </div>
      </div>

      {/* XP */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#f59e0b' }}>
          {xp.toLocaleString()}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af' }}>XP</div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useUser();
  const { progress } = useUserProgress();

  const [tab,        setTab]       = useState<'global' | 'friends'>('global');
  const [globalList, setGlobal]    = useState<any[]>([]);
  const [friendList, setFriends]   = useState<any[]>([]);
  const [loading,    setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([getLeaderboard(), getFriendsLeaderboard()]).then(([g, f]) => {
      const globalData = g.status === 'fulfilled' && Array.isArray(g.value) && g.value.length > 0
        ? g.value : MOCK_GLOBAL;
      setGlobal(globalData);
      if (f.status === 'fulfilled' && Array.isArray(f.value)) setFriends(f.value);
      setLoading(false);
    });
  }, []);

  const myXp    = progress.xp;
  const myLevel = progress.level ?? 1;
  const myLeague = getLeague(myXp);

  const activeList = tab === 'global' ? globalList : friendList;

  // Inject me if not in list
  const meId = user?.id;
  const myName = user?.name ?? user?.email?.split('@')[0] ?? 'Moi';
  const listWithMe = meId && !activeList.find(u => u.id === meId)
    ? [...activeList, { id: meId, name: myName, xp: myXp, level: myLevel }].sort((a, b) => b.xp - a.xp)
    : activeList;

  const myRank = listWithMe.findIndex(u => u.id === meId) + 1;
  const totalPlayers = listWithMe.length;

  // Promotion / relegation thresholds
  const promoCount = Math.max(1, Math.round(totalPlayers * 0.1));
  const relegCount = Math.max(1, Math.round(totalPlayers * 0.1));

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 80px' }}>

      {/* Header */}
      <div style={{ padding: '32px 16px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 6 }}>Classement</h1>

        {/* My league banner */}
        <div style={{
          background: `linear-gradient(135deg, ${myLeague.color}20, ${myLeague.color}08)`,
          border: `2px solid ${myLeague.color}40`,
          borderRadius: 20, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 36 }}>{myLeague.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: myLeague.color }}>
              Ligue {myLeague.name}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
              {myRank > 0 ? `Tu es #${myRank} sur ${totalPlayers} joueurs` : 'Commence à jouer pour apparaître !'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>{myXp.toLocaleString()}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>XP</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px', marginBottom: 16 }}>
        {([['global', '🌍 Global'], ['friends', '👥 Amis']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: '10px', borderRadius: 14,
            fontWeight: 800, fontSize: 13, cursor: 'pointer', border: 'none',
            background: tab === key ? '#111827' : '#f3f4f6',
            color: tab === key ? 'white' : '#6b7280',
            transition: 'all 0.15s',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      {totalPlayers > 3 && (
        <div style={{ padding: '0 16px', marginBottom: 8, display: 'flex', gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>
            ↑ Top {promoCount} → promotion
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>
            ↓ Bottom {relegCount} → relégation
          </div>
        </div>
      )}

      {/* List */}
      <div style={{
        background: 'white', borderRadius: 24, overflow: 'hidden',
        border: '2px solid #f0f0f0', margin: '0 16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Chargement…</div>
        ) : listWithMe.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            {tab === 'friends' ? 'Ajoute des amis pour les voir ici !' : 'Aucun joueur pour l\'instant.'}
          </div>
        ) : (
          listWithMe.map((u, idx) => {
            const rank = idx + 1;
            const isPromo = rank <= promoCount;
            const isReleg = rank > totalPlayers - relegCount && totalPlayers > 3;
            return (
              <div key={u.id} style={{
                borderLeft: isPromo ? '4px solid #10b981' : isReleg ? '4px solid #ef4444' : undefined,
              }}>
                <UserRow
                  rank={rank}
                  name={u.id === meId ? myName : (u.name ?? 'Anonyme')}
                  xp={u.id === meId ? myXp : u.xp}
                  level={u.id === meId ? myLevel : (u.level ?? 1)}
                  isMe={u.id === meId}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Promo/Releg legend bottom */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10b981', fontWeight: 700 }}>
          <div style={{ width: 12, height: 12, background: '#10b981', borderRadius: 3 }} />
          Zone promotion
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
          <div style={{ width: 12, height: 12, background: '#ef4444', borderRadius: 3 }} />
          Zone relégation
        </div>
      </div>
    </div>
  );
}
