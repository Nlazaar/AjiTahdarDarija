'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

export default function WelcomePage() {
  const { t } = useLanguage();
  const { setMascot, setUserName } = useUser();
  const [step, setStep] = React.useState(0);
  const [selectedMascot, setSelectedMascotLocal] = React.useState('/images/maroccan-lion.png');
  const [showInput, setShowInput] = React.useState(false);
  const [localName, setLocalName] = React.useState('');

  const mascots = [
    { id: 'boy', name: t.welcome.mascotBoy, img: '/images/maroccan-child.png' },
    { id: 'lion', name: t.welcome.mascotLion, img: '/images/maroccan-lion.png' },
    { id: 'girl', name: t.welcome.mascotGirl, img: '/images/maroccan-girl.png' }
  ];

  const handleMascotSelect = (img: string) => {
    setSelectedMascotLocal(img);
    setMascot(img); // Global save
    setStep(1);
  };

  const handleNameSubmit = () => {
    setUserName(localName); // Global save
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#ffffff', 
      fontFamily: '"Nunito", "Inter", sans-serif',
      position: 'relative'
    }}>
      {/* 1. Progress Bar */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        padding: '24px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px' 
      }}>
        <div style={{ 
          flex: 1, 
          height: '16px', 
          backgroundColor: '#e5e5e5', 
          borderRadius: '10px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            width: step === 0 ? '5%' : '15%', 
            height: '100%', 
            backgroundColor: '#58cc02', 
            borderRadius: '10px',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        width: '100%',
        maxWidth: '1000px',
        gap: '40px'
      }}>
        
        {step === 0 ? (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#4b4b4b', marginBottom: '48px' }}>
              {t.welcome.chooseMascot}
            </h1>
            <div style={{ 
              display: 'flex', 
              gap: '40px', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}>
              {mascots.map((m) => (
                <div 
                  key={m.id} 
                  onClick={() => handleMascotSelect(m.img)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    padding: '20px',
                    borderRadius: '24px',
                    border: '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.backgroundColor = '#f7f7f7';
                    e.currentTarget.style.borderColor = '#e5e5e5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <img src={m.img} alt={m.name} style={{ width: '160px', height: 'auto' }} />
                  <span style={{ fontWeight: '800', color: '#777', fontSize: '20px' }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            width: '100%',
            maxWidth: '800px',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            {/* Mascot */}
            <div className="animate-mascot" style={{ width: '200px', flexShrink: 0 }}>
              <img 
                src={selectedMascot} 
                alt="Mascot Teacher" 
                style={{ width: '100%', height: 'auto' }}
              />
            </div>

            {/* Right Column: Bubble + Interaction */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              width: '100%',
              maxWidth: '450px'
            }}>
              {/* Speech Bubble */}
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #e5e5e5',
                borderRadius: '24px',
                padding: '30px',
                position: 'relative',
                width: '100%',
                marginBottom: '40px',
                boxShadow: '0 4px 0 #e5e5e5'
              }}>
                {/* Arrow */}
                <div style={{
                  position: 'absolute',
                  left: '-12px',
                  top: '40px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderLeft: '2px solid #e5e5e5',
                  borderBottom: '2px solid #e5e5e5',
                  transform: 'rotate(45deg)'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#4b4b4b',
                    lineHeight: '1.5'
                  }}>
                    {!showInput ? (
                      <>
                        <div style={{ marginBottom: '15px' }}>
                          <span style={{ fontWeight: '900', fontSize: '24px' }}>سلام، أنا الأستاذة ديالك.</span><br />
                          <span style={{ color: '#777' }}>{t.welcome.salamTeacher}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: '900', fontSize: '24px' }}>واش بغيتي تعطيني شي سمية؟</span><br />
                          <span style={{ color: '#777' }}>{t.welcome.giveMeName}</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: '900', fontSize: '24px' }}>عطيني شي سمية زوينة !</span><br />
                        <span style={{ color: '#777' }}>{t.welcome.giveMeNiceName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Interaction Elements */}
              {!showInput ? (
                <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setShowInput(true)}
                    style={iconButtonStyle('#58cc02', '#46a302')}
                  >
                    {t.common.yes}
                  </button>
                  <Link href="/welcome/level" style={{ textDecoration: 'none' }}>
                    <button 
                      style={iconButtonStyle('#afafaf', '#8f8f8f')}
                    >
                      {t.common.no}
                    </button>
                  </Link>
                </div>
              ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                  <input 
                    type="text"
                    autoFocus
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder={t.welcome.placeholderName}
                    style={{
                      width: '100%',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '2px solid #e5e5e5',
                      backgroundColor: '#f7f7f7',
                      fontSize: '18px',
                      fontWeight: '700',
                      outline: 'none',
                      color: '#4b4b4b',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1cb0f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  />
                  <Link href="/welcome/level" style={{ textDecoration: 'none', width: '100%' }}>
                    <button 
                      onClick={handleNameSubmit}
                      style={{
                        width: '100%',
                        backgroundColor: '#58cc02',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '18px',
                        fontSize: '17px',
                        fontWeight: '900',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        boxShadow: '0 5px 0 #46a302',
                        textTransform: 'uppercase',
                        transition: 'filter 0.1s'
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {t.common.continue}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer Spacer */}
      <div style={{ height: '80px' }} />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-mascot {
          animation: bounce 2.5s infinite ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}

function iconButtonStyle(bg: string, shadow: string) {
  return {
    backgroundColor: 'white',
    border: '2px solid #e5e5e5',
    borderRadius: '16px',
    padding: '16px 40px',
    fontSize: '15px',
    fontWeight: '900',
    color: bg,
    cursor: 'pointer',
    boxShadow: `0 4px 0 ${shadow === '#8f8f8f' ? '#e5e5e5' : '#e5e5e5'}`,
    textTransform: 'uppercase' as const,
    transition: 'all 0.1s'
  };
}
