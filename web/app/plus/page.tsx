'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useUserProgress } from '@/contexts/UserProgressContext';

type Item = {
  href: string;
  label: string;
  icon: string;
  desc?: string;
  badge?: boolean;
};

type Section = {
  title: string;
  items: Item[];
};

export default function PlusPage() {
  const router = useRouter();
  const { user, userName, mascot, logout } = useUser();
  const { progress } = useUserProgress();

  const displayName = user?.name || userName || 'Apprenant';
  const niveau =
    progress.xp >= 5000 ? 'Platine' :
    progress.xp >= 2000 ? 'Or' :
    progress.xp >= 1000 ? 'Argent' : 'Bronze';
  const hasQuestDot = progress.quetes.some(q => q.current < q.total);

  const sections: Section[] = [
    {
      title: 'Apprentissage',
      items: [
        { href: '/quests',       label: 'Quêtes',       icon: '🎁', desc: 'Défis quotidiens et hebdomadaires.', badge: hasQuestDot },
        { href: '/revision',     label: 'Révision',     icon: '🔁', desc: 'Révise les mots vus récemment.' },
        { href: '/alphabet',     label: 'Alphabet',     icon: 'ا',  desc: 'Redécouvre les 28 lettres arabes.' },
        { href: '/conversation', label: 'Conversation', icon: '💬', desc: 'Discute avec une IA en darija.' },
      ],
    },
    {
      title: 'Découverte',
      items: [
        { href: '/decouverte/carte-postale', label: 'Carte postale', icon: '📮', desc: 'La ville liée à ton unité en cours.' },
        { href: '/decouverte/carte-maroc',   label: 'Carte du Maroc', icon: '🗺️', desc: 'Explore les villes au fur et à mesure.' },
      ],
    },
    {
      title: 'Social',
      items: [
        { href: '/friends', label: 'Amis',  icon: '👥', desc: 'Invite et suis les progrès de tes amis.' },
        { href: '/duels',   label: 'Duels', icon: '⚔️', desc: 'Affronte d\'autres apprenants en temps réel.' },
      ],
    },
    {
      title: 'Compte',
      items: [
        { href: '/plus/apparence', label: 'Apparence',   icon: '🎨', desc: 'Forme des nœuds, style du chemin.' },
        { href: '/abonnement',     label: 'Abonnement',  icon: '💎', desc: 'Passe à la version premium.' },
        { href: '/settings',       label: 'Réglages',    icon: '⚙️', desc: 'Langue, notifications, compte.' },
        { href: '/aide',           label: 'Aide',        icon: '❓', desc: 'FAQ, contact et support.' },
      ],
    },
  ];

  const onLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '20px 16px 100px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* ── Header profil ─────────────────────────────────── */}
        <Link
          href="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            background: 'var(--c-card)',
            border: '1.5px solid var(--c-border)',
            borderRadius: 16,
            textDecoration: 'none',
            marginBottom: 22,
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--c-bg)', border: '1.5px solid var(--c-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            {mascot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mascot} alt="" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 26 }}>👤</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 16, fontWeight: 900, color: 'var(--c-text)',
              letterSpacing: '-0.01em', marginBottom: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {displayName}
            </div>
            <div style={{
              fontSize: 11, fontWeight: 800, color: 'var(--c-sub)',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              Niveau {niveau} · {progress.xp} XP
            </div>
            <div style={{
              display: 'flex', gap: 10, marginTop: 6,
              fontSize: 11, fontWeight: 700, color: 'var(--c-sub)',
            }}>
              <span>🔥 {progress.streak}</span>
              <span>💎 {progress.gemmes}</span>
              <span>❤️ {progress.hearts}</span>
            </div>
          </div>
          <span style={{ color: 'var(--c-sub)', fontSize: 18, flexShrink: 0 }}>›</span>
        </Link>

        {/* ── Sections ───────────────────────────────────────── */}
        {sections.map(section => (
          <div key={section.title} style={{ marginBottom: 22 }}>
            <h2 style={{
              fontSize: 11, fontWeight: 900,
              color: 'var(--c-sub)', letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0 0 8px 4px',
            }}>
              {section.title}
            </h2>
            <div style={{
              background: 'var(--c-card)',
              border: '1.5px solid var(--c-border)',
              borderRadius: 14,
              overflow: 'hidden',
            }}>
              {section.items.map((it, idx) => (
                <Link
                  key={it.href}
                  href={it.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    textDecoration: 'none',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--c-border)',
                    position: 'relative',
                  }}
                >
                  <span style={{
                    width: 38, height: 38, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 19,
                    fontFamily: it.icon === 'ا' ? 'var(--font-amiri), serif' : undefined,
                    fontWeight: 900,
                    background: 'var(--c-bg)',
                    color: 'var(--c-text)',
                    border: '1.5px solid var(--c-border)',
                    flexShrink: 0,
                  }}>
                    {it.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 800, color: 'var(--c-text)',
                      letterSpacing: '-0.005em',
                    }}>
                      {it.label}
                    </div>
                    {it.desc && (
                      <div style={{
                        fontSize: 12, color: 'var(--c-sub)',
                        lineHeight: 1.35, marginTop: 2,
                      }}>
                        {it.desc}
                      </div>
                    )}
                  </div>
                  {it.badge && (
                    <span style={{
                      width: 8, height: 8,
                      background: '#ff4b4b', borderRadius: '50%',
                      flexShrink: 0,
                    }} />
                  )}
                  <span style={{ color: 'var(--c-sub)', fontSize: 18, flexShrink: 0 }}>›</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* ── Déconnexion ─────────────────────────────────────── */}
        {user && (
          <button
            type="button"
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'transparent',
              border: '1.5px solid var(--c-border)',
              borderRadius: 14,
              color: '#dc2626',
              fontSize: 14, fontWeight: 800,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Se déconnecter
          </button>
        )}
      </div>
    </div>
  );
}
