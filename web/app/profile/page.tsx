'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getGamification, getMyProgress, getProfile, getFriends, updateProfile } from '@/lib/api';

const AVATAR_KEY = 'darija_avatar';
const PRESET_AVATARS = [
  '🦁','🦉','🐯','🦊','🐺','🦅','🐻','🦋',
  '🤴','👸','🧙','🥷','👩‍🎓','🧑‍🏫','🧔','👩',
];

function AvatarPicker({ current, onSelect, onClose }: {
  current: string; onSelect: (v: string) => void; onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { onSelect(reader.result as string); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440, margin: '0 16px',
          background: 'var(--c-card)', borderRadius: 24,
          padding: '20px 20px 24px',
          border: '1px solid var(--c-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--c-text)' }}>Choisir un avatar</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--c-sub)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Preset grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8, marginBottom: 16 }}>
          {PRESET_AVATARS.map(av => (
            <button
              key={av}
              onClick={() => onSelect(av)}
              style={{
                width: '100%', aspectRatio: '1', borderRadius: 12,
                border: `2px solid ${current === av ? '#58cc02' : 'var(--c-border)'}`,
                background: current === av ? 'rgba(88,204,2,0.12)' : 'var(--c-card2)',
                fontSize: 26, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {av}
            </button>
          ))}
        </div>

        {/* Upload */}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%', padding: '12px', borderRadius: 14,
            background: 'var(--c-card2)', border: '1px solid var(--c-border)',
            color: 'var(--c-sub)', fontSize: 13, fontWeight: 800, cursor: 'pointer',
          }}
        >
          📷 Importer une photo
        </button>
      </div>
    </div>
  );
}

/* ─── Colors ──────────────────────────────────────────────────────────────── */
const BG     = 'var(--c-bg)';
const CARD = 'var(--c-card)';
const CARD2 = 'var(--c-card2)';
const BORDER = 'var(--c-border)';
const TEXT   = 'var(--c-text)';
const SUB    = 'var(--c-sub)';
const GREEN = '#58cc02';

/* ─── League config ───────────────────────────────────────────────────────── */
const LEAGUES = [
  { min: 0,     name: 'Bronze',  color: '#cd7f32', icon: '🥉' },
  { min: 1000,  name: 'Argent',  color: '#9e9e9e', icon: '🥈' },
  { min: 2000,  name: 'Or',      color: '#f5c518', icon: '🥇' },
  { min: 5000,  name: 'Diamant', color: '#42a5f5', icon: '💎' },
  { min: 10000, name: 'Master',  color: '#7c3aed', icon: '👑' },
];

function getLeague(xp: number) {
  return [...LEAGUES].reverse().find(l => xp >= l.min) ?? LEAGUES[0];
}

/* ─── Achievement definitions ─────────────────────────────────────────────── */
function buildAchievements(gami: any, completedCount: number) {
  const xp     = gami?.xp     ?? 0;
  const streak = gami?.streak ?? 0;
  const hearts = gami?.hearts ?? 5;

  return [
    {
      id: 'streak_7', emoji: '🔥', iconBg: ['#ff6b35', '#ef4444'],
      title: 'Feu sacré', description: 'Réaliser une série de 7 jours',
      current: Math.min(streak, 7), total: 7,
      levelThresholds: [1, 3, 7, 14, 30],
    },
    {
      id: 'xp_total', emoji: '⚡', iconBg: ['#f59e0b', '#fbbf24'],
      title: 'Puits de science', description: 'Gagner 5 000 XP',
      current: Math.min(xp, 5000), total: 5000,
      levelThresholds: [100, 500, 1000, 2500, 5000],
    },
    {
      id: 'lessons', emoji: '🕌', iconBg: ['#10b981', '#34d399'],
      title: 'Explorateur', description: 'Terminer 10 leçons',
      current: Math.min(completedCount, 10), total: 10,
      levelThresholds: [1, 3, 5, 7, 10],
    },
    {
      id: 'hearts_full', emoji: '❤️', iconBg: ['#ec4899', '#f472b6'],
      title: 'Invincible', description: 'Conserver 5 cœurs',
      current: Math.min(hearts, 5), total: 5,
      levelThresholds: [1, 2, 3, 4, 5],
    },
    {
      id: 'league', emoji: '🏆', iconBg: ['#7c3aed', '#a78bfa'],
      title: 'Grimpeur', description: 'Atteindre la ligue Or',
      current: Math.min(LEAGUES.findIndex(l => xp >= l.min && xp < (LEAGUES[LEAGUES.indexOf(l) + 1]?.min ?? Infinity)) + 1, 3),
      total: 3, levelThresholds: [1, 2, 3],
    },
  ];
}

function getAchievementLevel(current: number, thresholds: number[]) {
  let lvl = 0;
  for (const t of thresholds) { if (current >= t) lvl++; else break; }
  return lvl;
}

/* ─── Stat card ───────────────────────────────────────────────────────────── */
function StatCard({ icon, value, label, sub, color }: {
  icon: string; value: string | number; label: string; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: CARD, borderRadius: 18, padding: '18px 16px',
      border: `1px solid ${BORDER}`, position: 'relative', overflow: 'hidden',
    }}>
      {sub && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: GREEN, color: 'white',
          fontSize: 9, fontWeight: 900, padding: '3px 7px',
          borderRadius: 6, letterSpacing: '0.05em',
        }}>
          {sub}
        </div>
      )}
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: color ?? TEXT, lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div style={{ fontSize: 12, color: SUB, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ─── Achievement card ────────────────────────────────────────────────────── */
function AchievementCard({ emoji, iconBg, title, description, current, total, levelThresholds }: ReturnType<typeof buildAchievements>[0]) {
  const level = getAchievementLevel(current, levelThresholds);
  const pct   = Math.min(100, Math.round((current / total) * 100));
  const done  = current >= total;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      background: CARD, borderRadius: 20, padding: '16px',
      border: `1px solid ${BORDER}`,
    }}>
      {/* Icon */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: `linear-gradient(135deg, ${iconBg[0]}, ${iconBg[1]})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, boxShadow: `0 4px 10px ${iconBg[0]}50`,
        }}>
          {emoji}
        </div>
        {level > 0 && (
          <div style={{
            position: 'absolute', bottom: -4, right: -4,
            background: CARD2, color: TEXT,
            fontSize: 9, fontWeight: 900, padding: '2px 6px',
            borderRadius: 6, border: `1px solid ${BORDER}`,
          }}>
            NIV. {level}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>{title}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: done ? GREEN : SUB, flexShrink: 0, marginLeft: 8 }}>
            {current.toLocaleString()}/{total.toLocaleString()}
          </div>
        </div>
        <div style={{ height: 8, background: 'var(--c-border)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{
            height: '100%', borderRadius: 99, width: `${pct}%`,
            background: done
              ? `linear-gradient(90deg, ${GREEN}, #86efac)`
              : `linear-gradient(90deg, ${iconBg[0]}, ${iconBg[1]})`,
            transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
        <div style={{ fontSize: 11, color: SUB, fontWeight: 600 }}>{description}</div>
      </div>
    </div>
  );
}

/* ─── Friends strip ───────────────────────────────────────────────────────── */
function FriendsStrip({ meId }: { meId?: string }) {
  const [friends, setFriends] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getFriends().then(d => setFriends(Array.isArray(d) ? d.slice(0, 4) : [])).catch(() => {});
  }, []);

  return (
    <div style={{
      background: CARD, borderRadius: 20, padding: '18px 16px',
      border: `1px solid ${BORDER}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: TEXT }}>Amis</span>
        <button
          onClick={() => router.push('/friends')}
          style={{ fontSize: 12, fontWeight: 700, color: '#1cb0f6', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Voir tout →
        </button>
      </div>

      {friends.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>👥</div>
          <div style={{ fontSize: 13, color: SUB, fontWeight: 600, marginBottom: 12 }}>
            Tu n'as pas encore d'amis
          </div>
          <button
            onClick={() => router.push('/friends')}
            style={{
              padding: '10px 20px', borderRadius: 12,
              background: GREEN, color: 'white',
              fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer',
              boxShadow: `0 3px 0 #46a302`,
            }}
          >
            🔍 Trouver des amis
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {friends.map((f: any) => {
            const friend = f.fromId === meId ? f.to : f.from;
            const name   = friend?.name ?? friend?.email?.split('@')[0] ?? 'Anonyme';
            const xp     = friend?.xp ?? 0;
            const league = getLeague(xp);
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${league.color}, ${league.color}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900, color: 'white',
                }}>
                  {name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>{name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                    {xp.toLocaleString()} XP
                  </div>
                </div>
              </div>
            );
          })}
          <button
            onClick={() => router.push('/friends')}
            style={{
              marginTop: 4, padding: '10px', borderRadius: 12,
              background: CARD2, color: SUB,
              fontSize: 12, fontWeight: 800, border: `1px solid ${BORDER}`, cursor: 'pointer',
            }}
          >
            🔍 Trouver des amis
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, logout } = useUser();
  const { progress }     = useUserProgress();
  const router           = useRouter();

  const [gamification, setGamification] = useState<any>(null);
  const [userProgress,  setUserProgress] = useState<any>(null);
  const [profileData,   setProfileData]  = useState<any>(null);
  const [loading,       setLoading]      = useState(true);
  const [showAllAchievements, setShowAll] = useState(false);
  const [avatar,        setAvatarState]  = useState<string>('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSelectAvatar = (v: string) => {
    setAvatarState(v);
    localStorage.setItem(AVATAR_KEY, v);
    setShowAvatarPicker(false);
    updateProfile({ avatar: v }).catch(() => {});
  };

  useEffect(() => {
    Promise.allSettled([getGamification(), getMyProgress(), getProfile()]).then(([g, p, pr]) => {
      if (g.status  === 'fulfilled') setGamification(g.value);
      if (p.status  === 'fulfilled') setUserProgress(p.value);
      if (pr.status === 'fulfilled') {
        setProfileData(pr.value);
        // Priorité : avatar serveur > localStorage
        const serverAvatar = pr.value?.avatar;
        if (serverAvatar) {
          setAvatarState(serverAvatar);
          localStorage.setItem(AVATAR_KEY, serverAvatar);
        } else {
          const saved = localStorage.getItem(AVATAR_KEY);
          if (saved) setAvatarState(saved);
        }
      } else {
        const saved = localStorage.getItem(AVATAR_KEY);
        if (saved) setAvatarState(saved);
      }
      setLoading(false);
    });
  }, []);

  const xp        = gamification?.xp     ?? progress.xp;
  const streak    = gamification?.streak ?? progress.streak;
  const hearts    = gamification?.hearts ?? progress.hearts;
  const level     = gamification?.level  ?? progress.level ?? 1;
  const league    = getLeague(xp);
  const completed = userProgress?.completedLessons?.length ?? progress.completedLessons.length;

  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Apprenant';
  const username    = user?.email?.split('@')[0] ?? '';
  const initials    = displayName.slice(0, 2).toUpperCase();

  const joinDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : null;

  const achievements = buildAchievements({ xp, streak, hearts }, completed);
  const visibleAchievements = showAllAchievements ? achievements : achievements.slice(0, 3);

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px', color: TEXT }}>

      {showAvatarPicker && (
        <AvatarPicker
          current={avatar}
          onSelect={handleSelectAvatar}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        margin: '0 -16px', padding: '40px 24px 28px',
        background: `linear-gradient(160deg, ${league.color}20 0%, transparent 100%)`,
        borderBottom: `1px solid ${BORDER}`,
        position: 'relative',
      }}>
        {/* Logout */}
        <button onClick={handleLogout} style={{
          position: 'absolute', top: 20, right: 20,
          padding: '7px 14px', borderRadius: 10,
          background: 'rgba(255,75,75,0.15)', border: '1px solid rgba(255,75,75,0.3)',
          color: '#ff4b4b', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>
          Déconnexion
        </button>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            {/* Avatar tile */}
            <div style={{
              width: 88, height: 88, borderRadius: 26,
              background: `linear-gradient(135deg, ${league.color}, ${league.color}99)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: avatar && !avatar.startsWith('data:') ? 46 : 32,
              fontWeight: 900, color: 'white',
              boxShadow: `0 6px 24px ${league.color}40`,
              border: `3px solid var(--c-border)`,
              overflow: 'hidden',
            }}>
              {avatar
                ? avatar.startsWith('data:')
                  ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : avatar
                : initials
              }
            </div>
            {/* Edit button */}
            <button
              onClick={() => setShowAvatarPicker(true)}
              style={{
                position: 'absolute', bottom: -6, right: -6,
                width: 26, height: 26, borderRadius: '50%',
                background: '#1cb0f6', border: '2px solid #131f24',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, cursor: 'pointer', color: 'white',
              }}
            >
              ✏️
            </button>
            {/* League badge */}
            <div style={{
              position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
              background: CARD2, borderRadius: 12, padding: '3px 8px',
              border: `1px solid ${league.color}50`,
              fontSize: 11, fontWeight: 900, color: league.color,
              display: 'flex', alignItems: 'center', gap: 3,
              whiteSpace: 'nowrap',
            }}>
              {league.icon} {league.name}
            </div>
          </div>

          <div style={{ flex: 1, paddingBottom: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: TEXT, lineHeight: 1.1, marginBottom: 3 }}>
              {displayName}
            </div>
            {username && (
              <div style={{ fontSize: 13, color: SUB, fontWeight: 600, marginBottom: 4 }}>@{username}</div>
            )}
            {joinDate && (
              <div style={{ fontSize: 12, color: SUB, fontWeight: 600 }}>Membre depuis {joinDate}</div>
            )}
          </div>
        </div>

        {/* XP progress bar */}
        <div style={{
          background: CARD, borderRadius: 14, padding: '12px 16px',
          border: `1px solid ${league.color}30`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: SUB }}>{xp % 1000} / 1 000 XP</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: league.color }}>Prochain palier</span>
          </div>
          <div style={{ height: 10, background: 'var(--c-border)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${(xp % 1000) / 10}%`,
              background: `linear-gradient(90deg, ${league.color}99, ${league.color})`,
              transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
            }} />
          </div>
        </div>
      </div>

      {/* ── Stats 2×2 ─────────────────────────────────────────────────── */}
      <div style={{ marginTop: 24, marginBottom: 8 }}>
        <h2 style={{ fontSize: 17, fontWeight: 900, color: TEXT, marginBottom: 14 }}>Statistiques</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <StatCard icon="🔥" value={streak}             label="Jours d'affilée"  color="#ff9600" />
          <StatCard icon="⚡" value={xp.toLocaleString()} label="XP gagnés"        color="#fbbf24" />
          <StatCard icon={league.icon} value={league.name} label="Division actuelle" sub="SEMAINE 1" color={league.color} />
          <StatCard icon="🕌" value={completed}           label="Leçons terminées" color={GREEN}   />
        </div>
      </div>

      {/* ── Succès ────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: TEXT, margin: 0 }}>Succès</h2>
          <button
            onClick={() => setShowAll(v => !v)}
            style={{ fontSize: 12, fontWeight: 700, color: '#1cb0f6', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {showAllAchievements ? 'RÉDUIRE' : 'AFFICHER TOUT'}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: SUB }}>Chargement…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visibleAchievements.map(a => <AchievementCard key={a.id} {...a} />)}
          </div>
        )}
      </div>

      {/* ── Amis ──────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 8 }}>
        <FriendsStrip meId={user?.id} />
      </div>
    </div>
  );
}
