'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatsPanel from '@/components/StatsPanel';

const BG = '#131f24';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuth    = pathname === '/login' || pathname === '/register' || pathname === '/' || pathname?.startsWith('/welcome');
  const isLesson  = pathname?.startsWith('/lesson');
  const isChat    = pathname?.startsWith('/practice');
  const showSidebar = !isAuth && !isLesson;

  if (showSidebar) {
    return (
      <div style={{ backgroundColor: BG, minHeight: '100vh', display: 'flex', overflowX: 'hidden' }}>
        {/* Col 1 — Left nav (fixe, ne scroll pas) */}
        <aside style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 260, height: '100vh',
          backgroundColor: BG,
          zIndex: 100,
          overflowY: 'auto',
          overflowX: 'hidden',
          flexShrink: 0,
        }}>
          <Sidebar />
        </aside>

        {/* Col 2 — Conteneur : contenu + panneau droit ensemble, centré */}
        <div style={{
          marginLeft: 260,
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh',
        }}>
          {/* Contenu principal */}
          <main style={{
            width: isChat ? '100%' : 540,
            height: '100vh',
            overflowY: isChat ? 'hidden' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isChat ? 'stretch' : 'center',
            paddingTop: isChat ? 0 : '2rem',
            paddingBottom: isChat ? 0 : '6rem',
          }}>
            <div style={{ width: '100%', maxWidth: isChat ? '100%' : '540px', flex: isChat ? 1 : 'none', minHeight: 0 }}>
              {children}
            </div>
          </main>

          {/* Panneau droit — petit espace avec le contenu */}
          <aside style={{
            marginLeft: 32,
            position: 'sticky',
            top: 0,
            width: 340,
            height: '100vh',
              padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: BG,
            flexShrink: 0,
          }}>
            <StatsPanel />
          </aside>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
