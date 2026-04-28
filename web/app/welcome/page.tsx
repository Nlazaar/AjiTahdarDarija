'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useUser, type LangTrack } from '@/context/UserContext';
import { useMascot, type MascotId } from '@/contexts/MascotContext';
import HomeLogoLink from '@/components/HomeLogoLink';
import LottiePlayer from '@/components/LottiePlayer';
import { TRACK_COLORS, TRACK_GRADIENT, ONBOARDING_BG } from '@/lib/trackColors';

type DialogueStrings = {
  salam: string;       // Ligne 1 (AR) — présentation du prof
  askName: string;     // Ligne 2 (AR) — demande du prénom
  giveNice: string;    // Après "oui", relance amicale
  salamSubFR: string;  // Sous-titre FR de la ligne salam
  askNameSubFR: string;
  giveNiceSubFR: string;
};

const DIALOGUES: Record<LangTrack, DialogueStrings> = {
  DARIJA: {
    salam: 'سلام، أنا الأستاذة ديالك.',
    askName: 'واش بغيتي تعطيني شي سمية؟',
    giveNice: 'عطيني شي سمية زوينة !',
    salamSubFR: 'Salam, je suis ta prof de Darija.',
    askNameSubFR: 'Tu veux bien me donner un prénom ?',
    giveNiceSubFR: 'Donne-moi un joli prénom !',
  },
  MSA: {
    salam: 'السَّلَامُ عَلَيْكُمْ، أَنَا مُعَلِّمَتُكَ.',
    askName: 'هَلْ تَوَدُّ أَنْ تُعْطِيَنِي اسْمَكَ؟',
    giveNice: 'أَعْطِنِي اسْمًا جَمِيلًا !',
    salamSubFR: 'Bonjour, je suis ton enseignante d\'arabe standard.',
    askNameSubFR: 'Accepterais-tu de me donner ton prénom ?',
    giveNiceSubFR: 'Donne-moi un beau prénom !',
  },
  RELIGION: {
    salam: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ.',
    askName: 'بِاسْمِ اللَّهِ، مَا اسْمُكَ الكَرِيم؟',
    giveNice: 'أَعْطِنِي اسْمًا طَيِّبًا بَارَكَ اللَّهُ فِيك !',
    salamSubFR: 'As-salāmu ʿalaykum — la paix soit sur toi.',
    askNameSubFR: 'Au nom de Dieu, quel est ton prénom ?',
    giveNiceSubFR: 'Donne-moi un beau prénom, qu\'Allah te bénisse !',
  },
};

export default function WelcomePage() {
  const { t } = useLanguage();
  const { setMascot, setUserName, langTrack } = useUser();
  const { setMascot: setMascotConfig } = useMascot();
  const [step, setStep] = React.useState(0);
  const [selectedMascot, setSelectedMascotLocal] = React.useState('/images/maroccan-lion.png');
  const [showInput, setShowInput] = React.useState(false);
  const [localName, setLocalName] = React.useState('');

  const d = DIALOGUES[langTrack];
  const tc = TRACK_COLORS[langTrack];

  const mascots = [
    { id: 'boy' as MascotId, name: t.welcome.mascotBoy, img: '/images/maroccan-child.png' },
    { id: 'lion' as MascotId, name: t.welcome.mascotLion, img: '/images/maroccan-lion.png' },
    { id: 'girl' as MascotId, name: t.welcome.mascotGirl, img: '/images/maroccan-girl.png' }
  ];

  const handleMascotSelect = (id: MascotId, img: string, name: string) => {
    setSelectedMascotLocal(img);
    setMascot(img); // UserContext (login/register display)
    setMascotConfig({ id, name }); // MascotContext (main app)
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
      width: '100%',
      overflowX: 'hidden',
      backgroundColor: ONBOARDING_BG,
      fontFamily: '"Nunito", "Inter", sans-serif',
      position: 'relative'
    }}>
      {/* Bande décorative 3-parcours */}
      <div style={{ width: '100%', height: 4, background: TRACK_GRADIENT }} />

      {/* 1. Header : logo home-link + Progress Bar */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        padding: '16px 20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <HomeLogoLink />
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
            backgroundColor: tc.color,
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
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out', width: '100%' }}>
            <div style={{ width: 'clamp(140px, 36vw, 180px)', aspectRatio: '1 / 1', margin: '0 auto 8px' }}>
              <LottiePlayer src="hello-buddy.json" size="100%" />
            </div>
            <h1 style={{
              fontSize: 'clamp(22px, 6vw, 32px)',
              fontWeight: '900',
              color: '#4b4b4b',
              marginBottom: 'clamp(24px, 5vw, 48px)',
              padding: '0 8px',
              lineHeight: 1.2,
            }}>
              {t.welcome.chooseMascot}
            </h1>
            <div style={{
              display: 'flex',
              gap: 'clamp(8px, 3vw, 40px)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}>
              {mascots.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleMascotSelect(m.id, m.img, m.name)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'clamp(8px, 2vw, 20px)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    padding: 'clamp(8px, 2vw, 20px)',
                    borderRadius: '24px',
                    border: '2px solid transparent',
                    flex: '0 0 calc(50% - clamp(8px, 3vw, 40px))',
                    maxWidth: '200px',
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
                  <img src={m.img} alt={m.name} style={{ width: 'clamp(90px, 26vw, 160px)', height: 'auto' }} />
                  <span style={{ fontWeight: '800', color: '#777', fontSize: 'clamp(14px, 3.5vw, 20px)' }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col md:flex-row"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              width: '100%',
              maxWidth: '800px',
              animation: 'fadeIn 0.5s ease-out'
            }}>
            {/* Mascot */}
            <div className="animate-mascot" style={{ width: 'clamp(120px, 32vw, 200px)', flexShrink: 0 }}>
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
                border: `2px solid ${tc.color}`,
                borderRadius: '24px',
                padding: '30px',
                position: 'relative',
                width: '100%',
                marginBottom: '40px',
                boxShadow: `0 4px 0 ${tc.tint}`
              }}>
                {/* Arrow — masquée sur mobile (mascotte au-dessus) */}
                <div
                  className="hidden md:block"
                  style={{
                    position: 'absolute',
                    left: '-12px',
                    top: '40px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderLeft: `2px solid ${tc.color}`,
                    borderBottom: `2px solid ${tc.color}`,
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
                          <span style={{ fontWeight: '900', fontSize: '24px', color: tc.color }}>{d.salam}</span><br />
                          <span style={{ color: '#777' }}>{d.salamSubFR}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: '900', fontSize: '24px', color: tc.color }}>{d.askName}</span><br />
                          <span style={{ color: '#777' }}>{d.askNameSubFR}</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: '900', fontSize: '24px', color: tc.color }}>{d.giveNice}</span><br />
                        <span style={{ color: '#777' }}>{d.giveNiceSubFR}</span>
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
                    style={iconButtonStyle(tc.color, tc.shadow)}
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
                    onFocus={(e) => e.target.style.borderColor = tc.color}
                    onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  />
                  <Link href="/welcome/level" style={{ textDecoration: 'none', width: '100%' }}>
                    <button 
                      onClick={handleNameSubmit}
                      style={{
                        width: '100%',
                        backgroundColor: tc.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '18px',
                        fontSize: '17px',
                        fontWeight: '900',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        boxShadow: `0 5px 0 ${tc.shadow}`,
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
