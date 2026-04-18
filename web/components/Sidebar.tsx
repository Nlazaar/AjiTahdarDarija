'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserProgress } from '@/contexts/UserProgressContext';

function NavItem({
  href, label, icon, isActive, badge = false,
}: {
  href: string; label: string; icon: string; isActive: boolean; badge?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '11px 14px',
        borderRadius: 16,
        textDecoration: 'none',
        transition: 'background 0.15s',
        background: isActive
          ? 'rgba(88,204,2,0.15)'
          : hovered
            ? 'var(--c-card2)'
            : 'transparent',
        width: '100%',
      }}
    >
      <span style={{
        width: 42, height: 42, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
        fontFamily: 'var(--font-amiri), serif',
        flexShrink: 0,
        background: isActive ? '#58cc02' : hovered ? 'var(--c-border-hard)' : 'var(--c-card)',
        color: isActive ? 'white' : 'var(--c-sub)',
        fontWeight: 900,
        boxShadow: isActive ? '0 2px 10px rgba(88,204,2,0.4)' : 'none',
        transition: 'background 0.15s, color 0.15s',
        border: isActive ? 'none' : '1.5px solid var(--c-border)',
      }}>
        {icon}
      </span>

      <span style={{
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        color: isActive ? '#58cc02' : hovered ? 'var(--c-text)' : 'var(--c-sub)',
        transition: 'color 0.15s',
      }}>
        {label}
      </span>

      {badge && (
        <span style={{
          position: 'absolute', top: 10, right: 14,
          width: 9, height: 9,
          background: '#ff4b4b', borderRadius: '50%',
          border: '2px solid var(--c-bg)',
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
    { href: '/cours',        label: 'Mon Cours',    icon: '🏠',  id: 'home',         active: isCours },
    { href: '/review',       label: 'Lettres',      icon: 'أ',   id: 'letters',      active: pathname === '/review' },
    { href: '/practice',     label: 'Entraînement', icon: '🏋️',  id: 'practice',     active: pathname === '/practice', badge: hasPracticeDot },
    { href: '/conversation', label: 'Conversation', icon: '💬',  id: 'conversation', active: pathname === '/conversation' },
    { href: '/leaderboard',  label: 'Ligues',       icon: '🛡️',  id: 'league',       active: pathname === '/leaderboard' },
    { href: '/quests',       label: 'Quêtes',       icon: '🎁',  id: 'quests',       active: pathname === '/quests', badge: hasQuestDot },
    { href: '/shop',         label: 'Boutique',     icon: '🏪',  id: 'shop',         active: pathname === '/shop' },
    { href: '/profile',      label: 'Profil',       icon: '👤',  id: 'profile',      active: pathname === '/profile' },
    { href: '/settings',     label: 'Plus',         icon: '⋯',   id: 'more',         active: pathname === '/settings' },
    { href: '/admin',        label: 'Admin',        icon: '🛠️',  id: 'admin',        active: pathname === '/admin' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', padding: '20px 12px',
      background: 'var(--c-bg)', position: 'sticky', top: 0,
      gap: 2, borderRight: '1px solid var(--c-nav-border)',
    }}>
      <Link href="/cours" style={{ textDecoration: 'none', marginBottom: 20, padding: '0 8px' }}>
        <div style={{
          fontSize: 20, fontWeight: 900, color: '#58cc02',
          fontFamily: 'var(--font-amiri), serif',
          direction: 'rtl', lineHeight: 1.3, letterSpacing: '0.01em',
        }}>
          أجي تهضر الدارجة
        </div>
      </Link>

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
