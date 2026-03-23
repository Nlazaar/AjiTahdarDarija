'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { languages } from '@/lib/translations';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { selectedLang, setSelectedLang, t } = useLanguage();

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '40px', 
        zIndex: 100,
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#afafaf',
        fontSize: '15px',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '12px 16px',
        borderRadius: '16px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f7f7f7';
        e.currentTarget.style.color = '#777';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#afafaf';
      }}
      >
        {t.common.siteLanguage} : {languages.find(l => l.id === selectedLang)?.name}
        <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '45px',
          right: '0',
          backgroundColor: 'white',
          border: '2px solid #e5e5e5',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          width: '400px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          animation: 'fadeInShort 0.2s ease-out'
        }}>
          {/* Dropdown Arrow */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '30px',
            width: '18px',
            height: '18px',
            backgroundColor: 'white',
            borderLeft: '2px solid #e5e5e5',
            borderTop: '2px solid #e5e5e5',
            transform: 'rotate(45deg)'
          }} />

          {languages.map((lang, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setSelectedLang(lang.id);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                borderRadius: '12px',
                transition: 'background-color 0.2s',
                color: selectedLang === lang.id ? '#1cb0f6' : '#4b4b4b',
                fontSize: '15px',
                fontWeight: '700'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ 
                fontSize: '20px', 
                width: '24px', 
                height: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                {lang.flag}
              </div>
              {lang.name}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInShort {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
