'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatsPanel from '@/components/StatsPanel';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuth    = pathname === '/login' || pathname === '/register' || pathname === '/' || pathname?.startsWith('/welcome');
  const isLesson  = pathname?.startsWith('/lesson');
  const isChat    = pathname?.startsWith('/practice');   // chat plein-écran dans la col centrale
  const showSidebar = !isAuth && !isLesson;

  if (showSidebar) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 300px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        width: '100%',
      }}>
        {/* Col 1 — Left nav */}
        <aside style={{ backgroundColor: 'white' }}>
          <Sidebar />
        </aside>

        {/* Col 2 — Main content */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isChat ? 'stretch' : 'center',
          paddingTop: isChat ? 0 : '2rem',
          paddingBottom: isChat ? 0 : '6rem',
          overflowY: isChat ? 'hidden' : 'auto',
          height: isChat ? '100vh' : 'auto',
        }}>
          <div style={{ width: '100%', maxWidth: isChat ? '100%' : '640px', flex: isChat ? 1 : 'none', minHeight: 0 }}>
            {children}
          </div>
        </main>

        {/* Col 3 — Right stats panel */}
        <aside style={{
          borderLeft: '2px solid #e5e5e5',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#fafafa',
        }}>
          <StatsPanel />
        </aside>
      </div>
    );
  }

  return <>{children}</>;
}
