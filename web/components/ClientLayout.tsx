'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatsPanel from '@/components/StatsPanel';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuth = pathname === '/login' || pathname === '/register' || pathname === '/' || pathname?.startsWith('/welcome');
  const isLesson = pathname?.startsWith('/lesson');
  const showSidebar = !isAuth && !isLesson;

  if (showSidebar) {
    return (
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: '96px 1fr 340px',
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          width: '100%'
        }}
      >
        {/* Column 1: Left Sidebar (Fixed width) */}
        <aside style={{ borderRight: '2px solid #e5e5e5', backgroundColor: '#233b5d' }}>
          <Sidebar />
        </aside>
        
        {/* Column 2: Central Content (Scrollable) */}
        <main 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            paddingTop: '2rem',
            paddingBottom: '6rem',
            overflowY: 'auto'
          }}
        >
          <div style={{ width: '100%', maxWidth: '640px' }}>
            {children}
          </div>
        </main>

        {/* Column 3: Right Sidebar (Sticky/Fixed) */}
        <aside 
          className="hidden xl:flex"
          style={{ 
            borderLeft: '2px solid #e5e5e5', 
            padding: '2rem',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto'
          }}
        >
          <StatsPanel />
        </aside>
      </div>
    );
  }

  return <>{children}</>;
}
