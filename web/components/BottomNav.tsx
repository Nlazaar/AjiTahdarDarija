'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserProgress } from '@/contexts/UserProgressContext';

const BG = 'var(--c-bg)';

const ITEMS = [
  { href: '/progress',    icon: '🏠', label: 'Cours'     },
  { href: '/review',      icon: 'أ',  label: 'Lettres'   },
  { href: '/practice',    icon: '🏋️', label: 'Entraîner' },
  { href: '/leaderboard', icon: '🛡️', label: 'Ligues'    },
  { href: '/plus',        icon: '⋯',  label: 'Plus'      },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { progress } = useUserProgress();

  const isCours = pathname === '/cours' || pathname === '/progress' || pathname?.startsWith('/progress/');
  const isPlus  = pathname === '/plus' || pathname?.startsWith('/plus/')
    || pathname === '/profile'
    || pathname === '/revision' || pathname?.startsWith('/revision/')
    || pathname === '/duels' || pathname === '/friends'
    || pathname === '/alphabet'
    || pathname === '/quests' || pathname === '/conversation'
    || pathname === '/abonnement' || pathname === '/aide'
    || pathname === '/settings'
    || pathname?.startsWith('/decouverte/');
  const hasQuestDot = progress.quetes.some(q => q.current < q.total);

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: BG,
      borderTop: '1px solid var(--c-nav-border)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {ITEMS.map(item => {
        const isActive = item.href === '/progress'
          ? isCours
          : item.href === '/plus'
            ? isPlus
            : pathname === item.href;
        const hasDot   = (item.href === '/practice' && progress.streak === 0)
          || (item.href === '/plus' && hasQuestDot);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 4px 10px',
              textDecoration: 'none',
              gap: 3,
              position: 'relative',
            }}
          >
            <span style={{
              fontSize: item.icon === 'أ' ? 20 : item.icon === '⋯' ? 26 : 22,
              fontFamily: item.icon === 'أ' ? 'var(--font-amiri), serif' : undefined,
              fontWeight: 900,
              color: isActive ? '#58cc02' : '#6b7f8a',
              lineHeight: 1,
            }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: isActive ? '#58cc02' : '#6b7f8a',
            }}>
              {item.label}
            </span>
            {hasDot && (
              <span style={{
                position: 'absolute', top: 6, right: '25%',
                width: 8, height: 8,
                background: '#ff4b4b', borderRadius: '50%',
                border: `2px solid ${BG}`,
              }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
