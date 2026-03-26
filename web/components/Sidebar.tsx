'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserProgress } from '@/contexts/UserProgressContext';

const BG   = '#131f24';
const CARD = '#1e2d36';

function NavItem({
  href, label, icon, isActive, badge = false,
}: {
  href: string; label: string; icon: string; isActive: boolean; badge?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '11px 14px',
        borderRadius: 16,
        textDecoration: 'none',
        transition: 'background 0.15s',
        background: isActive ? 'rgba(88,204,2,0.15)' : 'transparent',
        width: '100%',
      }}
    >
      {/* Icon */}
      <span style={{
        width: 42, height: 42, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: icon.length === 1 && /[\u0600-\u06FF]/.test(icon) ? 22 : 22,
        fontFamily: 'var(--font-amiri), serif',
        flexShrink: 0,
        background: isActive ? '#58cc02' : CARD,
        color: isActive ? 'white' : '#8b9eb0',
        fontWeight: 900,
        boxShadow: isActive ? '0 2px 10px rgba(88,204,2,0.4)' : 'none',
        transition: 'background 0.15s, color 0.15s',
      }}>
        {icon}
      </span>

      {/* Label */}
      <span style={{
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        color: isActive ? '#58cc02' : '#8b9eb0',
        transition: 'color 0.15s',
      }}>
        {label}
      </span>

      {/* Badge dot */}
      {badge && (
        <span style={{
          position: 'absolute', top: 10, right: 14,
          width: 9, height: 9,
          background: '#ff4b4b', borderRadius: '50%',
          border: `2px solid ${BG}`,
        }}/>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { progress } = useUserProgress();

  const hasQuestDot    = progress.quetes.some(q => q.current < q.total);
  const hasPracticeDot = progress.streak === 0;
  const isCours = pathname === '/cours' || pathname === '/progress' || pathname?.startsWith('/progress/');

  const items = [
    { href: '/cours',       label: 'Mon Cours',    icon: '🏠',  id: 'home',     active: isCours },
    { href: '/review',      label: 'Lettres',      icon: 'أ',   id: 'letters',  active: pathname === '/review' },
    { href: '/practice',    label: 'Entraînement', icon: '🏋️',  id: 'practice', active: pathname === '/practice', badge: hasPracticeDot },
    { href: '/leaderboard', label: 'Ligues',       icon: '🛡️',  id: 'league',   active: pathname === '/leaderboard' },
    { href: '/quests',      label: 'Quêtes',       icon: '🎁',  id: 'quests',   active: pathname === '/quests', badge: hasQuestDot },
    { href: '/shop',        label: 'Boutique',     icon: '🏪',  id: 'shop',     active: pathname === '/shop' },
    { href: '/profile',     label: 'Profil',       icon: '👤',  id: 'profile',  active: pathname === '/profile' },
    { href: '/settings',    label: 'Plus',         icon: '⋯',   id: 'more',     active: pathname === '/settings' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', padding: '20px 12px',
      background: BG, position: 'sticky', top: 0,
      gap: 2, borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Brand */}
      <Link href="/cours" style={{ textDecoration: 'none', marginBottom: 20, padding: '0 8px' }}>
        <div style={{
          fontSize: 20, fontWeight: 900, color: '#58cc02',
          fontFamily: 'var(--font-amiri), serif',
          direction: 'rtl', lineHeight: 1.3, letterSpacing: '0.01em',
        }}>
          أجي تهضر الدارجة
        </div>
      </Link>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {items.map(item => (
          <NavItem
            key={item.id}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={item.active}
            badge={item.badge}
          />
        ))}
      </nav>
    </div>
  );
}
