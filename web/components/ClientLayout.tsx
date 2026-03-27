'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatsPanel from '@/components/StatsPanel';
import BottomNav from '@/components/BottomNav';

const BG = '#131f24';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuth    = pathname === '/login' || pathname === '/register' || pathname === '/' || pathname?.startsWith('/welcome');
  const isLesson  = pathname?.startsWith('/lesson');
  const isChat    = pathname?.startsWith('/practice');
  const showSidebar = !isAuth && !isLesson;

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden' }} className="flex">

      {/* ── Sidebar gauche — cachée sur mobile, fixe sur md+ ── */}
      <aside
        className="hidden md:block"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 260, height: '100vh',
          backgroundColor: BG,
          zIndex: 100,
          overflowY: 'auto',
          overflowX: 'hidden',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Sidebar />
      </aside>

      {/* ── Zone centrale : contenu + panneau droit ── */}
      <div
        className="flex flex-1 justify-center md:ml-[260px]"
        style={{ minHeight: '100vh' }}
      >
        {/* Contenu principal */}
        <main
          className={`flex flex-col w-full ${isChat ? '' : 'md:w-[540px]'}`}
          style={{
            height: '100vh',
            overflowY: isChat ? 'hidden' : 'auto',
            alignItems: isChat ? 'stretch' : 'center',
            paddingTop: isChat ? 0 : '2rem',
            /* Mobile : padding bas pour la bottom nav ; desktop : padding normal */
            paddingBottom: isChat ? 0 : undefined,
          }}
        >
          <div
            className={`w-full ${!isChat ? 'px-4 md:px-0 pb-24 md:pb-24' : ''}`}
            style={{
              maxWidth: isChat ? '100%' : '540px',
              flex: isChat ? 1 : 'none',
              minHeight: 0,
            }}
          >
            {children}
          </div>
        </main>

        {/* Panneau droit — seulement sur xl+ */}
        <aside
          className="hidden xl:flex flex-col gap-4"
          style={{
            marginLeft: 32,
            position: 'sticky',
            top: 0,
            width: 340,
            height: '100vh',
            padding: '1.5rem',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: BG,
            flexShrink: 0,
          }}
        >
          <StatsPanel />
        </aside>
      </div>

      {/* ── Barre de nav bas — seulement sur mobile ── */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
