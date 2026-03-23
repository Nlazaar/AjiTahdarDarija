'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Dumbbell, User, Trophy, Settings, Map } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: <Map size={28} />, href: '/progress', id: 'learn', label: 'Apprendre' },
    { icon: <BookOpen size={28} />, href: '/review', id: 'review', label: 'Révisions' },
    { icon: <Dumbbell size={28} />, href: '/practice', id: 'practice', label: 'Entraînement' },
    { icon: <Trophy size={28} />, href: '/leaderboard', id: 'leaderboard', label: 'Classement' },
    { icon: <User size={28} />, href: '/profile', id: 'profile', label: 'Profil' },
  ];

  return (
    <div className="nav-sidebar">
      {/* Logo */}
      <Link href="/progress" className="mb-8 flex items-center justify-center">
        <img src="/images/logo.png" alt="Darija Maroc" style={{ width: 52, height: 52, objectFit: 'contain' }} />
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-col items-center flex-1 w-full px-3 gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={`nav-icon ${isActive ? 'active' : ''}`}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <Link
        href="/settings"
        title="Paramètres"
        className={`nav-icon ${pathname === '/settings' ? 'active' : ''}`}
      >
        <Settings size={28} />
      </Link>
    </div>
  );
}
