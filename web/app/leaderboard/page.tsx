'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getLeaderboard, getFriendsLeaderboard } from '@/lib/api';

/* ─── Colors ──────────────────────────────────────────────────────────────── */
const CARD   = '#1e2d36';
const CARD2  = '#243b4a';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT   = '#ffffff';
const SUB    = '#8b9eb0';
const GREEN  = '#58cc02';

const LEAGUE_CONFIG = [
  { min: 0,     name: 'Bronze',  color: '#cd7f32', icon: '🥉' },
  { min: 1000,  name: 'Argent',  color: '#9e9e9e', icon: '🥈' },
  { min: 2000,  name: 'Or',      color: '#f5c518', icon: '🥇' },
  { min: 5000,  name: 'Diamant', color: '#42a5f5', icon: '💎' },
  { min: 10000, name: 'Master',  color: '#7c3aed', icon: '👑' },
];

function getLeague(xp: number) {
  return [...LEAGUE_CONFIG].reverse().find(l => xp >= l.min) ?? LEAGUE_CONFIG[0];
}


function getRankMedal(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}

function UserRow({ rank, name, xp, level, isMe, isPromo, isReleg, avatar }: {
  rank: number; name: string; xp: number; level: number; isMe?: boolean; isPromo?: boolean; isReleg?: boolean; avatar?: string;
}) {
  const league = getLeague(xp);
  const medal  = getRankMedal(rank);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 20px',
      background: isMe ? `linear-gradient(90deg, ${league.color}18, ${league.color}06)` : 'transparent',
      borderBottom: `1px solid ${BORDER}`,
      borderLeft: `4px solid ${isMe ? league.color : isPromo ? GREEN : isReleg ? '#ff4b4b' : 'transparent'}`,
    }}>
      {/* Rank */}
      <div style={{
        width: 32, textAlign: 'center', flexShrink: 0,
        fontSize: medal ? 20 : 14, fontWeight: 900,
        color: medal ? undefined : (rank <= 10 ? TEXT : SUB),
      }}>
        {medal ?? rank}
      </div>

      {/* Avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg, ${league.color}, ${league.color}99)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isMe && avatar && !avatar.startsWith('data:') ? 24 : 15,
        fontWeight: 900, color: 'white',
        overflow: 'hidden',
        boxShadow: isMe ? `0 2px 10px ${league.color}40` : 'none',
      }}>
        {isMe && avatar
          ? avatar.startsWith('data:')
            ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : avatar
          : (name ?? '?').slice(0, 2).toUpperCase()
        }
      </div>

      {/* Name + league */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: isMe ? 900 : 700, color: TEXT }}>
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
        <div style={{ fontSize: 10, fontWeight: 700, color: SUB }}>XP</div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useUser();
  const { progress } = useUserProgress();

  const [tab,        setTab]     = useState<'global' | 'friends'>('global');
  const [globalList, setGlobal]  = useState<any[]>([]);
  const [friendList, setFriends] = useState<any[]>([]);
  const [loading,    setLoading] = useState(true);
  const [apiError,   setApiError] = useState(false);
  const [myAvatar,   setMyAvatar] = useState<string>('');

  useEffect(() => {
    setMyAvatar(localStorage.getItem('darija_avatar') ?? '');
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([getLeaderboard(), getFriendsLeaderboard()]).then(([g, f]) => {
      if (g.status === 'fulfilled' && Array.isArray(g.value) && g.value.length > 0) {
        setGlobal(g.value);
        setApiError(false);
      } else {
        setGlobal([]);
        setApiError(true);
      }
      if (f.status === 'fulfilled' && Array.isArray(f.value)) setFriends(f.value);
      setLoading(false);
    });
  }, []);

  const myXp    = progress.xp;
  const myLevel = progress.level ?? 1;
  const myLeague = getLeague(myXp);
  const meId     = user?.id;
  const myName   = user?.name ?? user?.email?.split('@')[0] ?? 'Moi';

  const activeList = tab === 'global' ? globalList : friendList;
  const listWithMe = meId && !activeList.find(u => u.id === meId)
    ? [...activeList, { id: meId, name: myName, xp: myXp, level: myLevel }].sort((a, b) => b.xp - a.xp)
    : activeList;

  const myRank     = listWithMe.findIndex(u => u.id === meId) + 1;
  const totalPlayers = listWithMe.length;
  const promoCount = Math.max(1, Math.round(totalPlayers * 0.1));
  const relegCount = Math.max(1, Math.round(totalPlayers * 0.1));

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 80px', color: TEXT }}>

      {/* Header */}
      <div style={{ padding: '32px 16px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, marginBottom: 16 }}>Classement</h1>

        {/* My league banner */}
        <div style={{
          background: `linear-gradient(135deg, ${myLeague.color}20, ${myLeague.color}08)`,
          border: `1px solid ${myLeague.color}40`,
          borderRadius: 20, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 36 }}>{myLeague.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: myLeague.color }}>
              Ligue {myLeague.name}
            </div>
            <div style={{ fontSize: 13, color: SUB, fontWeight: 600 }}>
              {myRank > 0 ? `Tu es #${myRank} sur ${totalPlayers} joueurs` : 'Commence à jouer pour apparaître !'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>{myXp.toLocaleString()}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: SUB }}>XP</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px', marginBottom: 16 }}>
        {([['global', '🌍 Global'], ['friends', '👥 Amis']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: '10px', borderRadius: 14,
            fontWeight: 800, fontSize: 13, cursor: 'pointer', border: 'none',
            background: tab === key ? GREEN : CARD,
            color: tab === key ? 'white' : SUB,
            boxShadow: tab === key ? '0 3px 0 #46a302' : 'none',
            transition: 'all 0.15s',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      {totalPlayers > 3 && (
        <div style={{ padding: '0 16px', marginBottom: 8, display: 'flex', gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>↑ Top {promoCount} → promotion</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff4b4b' }}>↓ Bottom {relegCount} → relégation</div>
        </div>
      )}

      {/* List */}
      <div style={{
        background: CARD, borderRadius: 24, overflow: 'hidden',
        border: `1px solid ${BORDER}`, margin: '0 16px',
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: SUB }}>Chargement…</div>
        ) : tab === 'global' && apiError ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📡</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, marginBottom: 6 }}>Classement indisponible</div>
            <div style={{ fontSize: 12, color: SUB }}>Impossible de charger le classement. Réessaie plus tard.</div>
          </div>
        ) : listWithMe.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: SUB }}>
            {tab === 'friends' ? 'Ajoute des amis pour les voir ici !' : "Aucun joueur pour l'instant."}
          </div>
        ) : (
          listWithMe.map((u, idx) => {
            const rank    = idx + 1;
            const isPromo = rank <= promoCount;
            const isReleg = rank > totalPlayers - relegCount && totalPlayers > 3;
            return (
              <UserRow
                key={u.id}
                rank={rank}
                name={u.id === meId ? myName : (u.name ?? 'Anonyme')}
                xp={u.id === meId ? myXp : u.xp}
                level={u.id === meId ? myLevel : (u.level ?? 1)}
                isMe={u.id === meId}
                isPromo={isPromo && !isReleg}
                isReleg={isReleg}
                avatar={u.id === meId ? myAvatar : undefined}
              />
            );
          })
        )}
      </div>

      {/* Legend bottom */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: GREEN, fontWeight: 700 }}>
          <div style={{ width: 12, height: 12, background: GREEN, borderRadius: 3 }} />
          Zone promotion
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#ff4b4b', fontWeight: 700 }}>
          <div style={{ width: 12, height: 12, background: '#ff4b4b', borderRadius: 3 }} />
          Zone relégation
        </div>
      </div>
    </div>
  );
}
