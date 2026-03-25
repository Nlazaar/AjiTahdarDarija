'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserProgress } from '@/contexts/UserProgressContext';

/* ─────────────────────────────────────────────
   ICONS (emoji-based, style Duolingo)
───────────────────────────────────────────── */
const ICONS: Record<string, string> = {
  home:     '🏠',
  letters:  'أ',
  practice: '🏋️',
  league:   '🛡️',
  quests:   '🎁',
  shop:     '🏪',
  profile:  '👤',
  more:     '⋯',
};

/* ─────────────────────────────────────────────
   NAV ITEM  (large, horizontal icon + label)
───────────────────────────────────────────── */
function NavItem({
  href, label, icon, isActive, badge = false,
}: {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
  badge?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        borderRadius: 16,
        textDecoration: 'none',
        transition: 'background 0.15s',
        background: isActive ? '#dbeafe' : 'transparent',
        width: '100%',
      }}
    >
      {/* Icon */}
      <span style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: icon.length === 1 && /[\u0600-\u06FF]/.test(icon) ? 22 : 24,
        fontFamily: 'var(--font-amiri), serif',
        flexShrink: 0,
        background: isActive ? 'white' : '#f3f4f6',
        color: isActive ? '#1d4ed8' : '#6b7280',
        fontWeight: 900,
        boxShadow: isActive ? '0 2px 8px rgba(29,78,216,0.15)' : 'none',
        transition: 'background 0.15s, color 0.15s',
      }}>
        {icon}
      </span>

      {/* Label */}
      <span style={{
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: isActive ? '#1d4ed8' : '#6b7280',
        transition: 'color 0.15s',
      }}>
        {label}
      </span>

      {/* Badge dot */}
      {badge && (
        <span style={{
          position: 'absolute',
          top: 10, right: 14,
          width: 10, height: 10,
          background: '#ef4444',
          borderRadius: '50%',
          border: '2px solid white',
        }}/>
      )}
    </Link>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname();
  const { progress } = useUserProgress();

  const hasQuestDot    = progress.quetes.some(q => q.current < q.total);
  const hasPracticeDot = progress.streak === 0;

  const isProgress = pathname === '/progress' || pathname?.startsWith('/progress/');

  const items = [
    { href: '/progress',     label: 'Mon Cours',    icon: ICONS.home,     id: 'home',     active: isProgress },
    { href: '/review',       label: 'Lettres',      icon: ICONS.letters,  id: 'letters',  active: pathname === '/review' },
    { href: '/practice',     label: 'Entraînement', icon: ICONS.practice, id: 'practice', active: pathname === '/practice', badge: hasPracticeDot },
    { href: '/leaderboard',  label: 'Ligues',       icon: ICONS.league,   id: 'league',   active: pathname === '/leaderboard' },
    { href: '/quests',       label: 'Quêtes',       icon: ICONS.quests,   id: 'quests',   active: pathname === '/quests', badge: hasQuestDot },
    { href: '/shop',         label: 'Boutique',     icon: ICONS.shop,     id: 'shop',     active: pathname === '/shop' },
    { href: '/profile',      label: 'Profil',       icon: ICONS.profile,  id: 'profile',  active: pathname === '/profile' },
    { href: '/settings',     label: 'Plus',         icon: ICONS.more,     id: 'more',     active: pathname === '/settings' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '20px 12px',
      background: 'white',
      position: 'sticky',
      top: 0,
      gap: 2,
      borderRight: '1.5px solid #f0f0f0',
    }}>

      {/* Brand */}
      <Link href="/progress" style={{ textDecoration: 'none', marginBottom: 20, padding: '0 8px' }}>
        <div style={{
          fontSize: 22,
          fontWeight: 900,
          color: '#58cc02',
          fontFamily: 'var(--font-amiri), serif',
          direction: 'rtl',
          lineHeight: 1.3,
          letterSpacing: '0.01em',
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
