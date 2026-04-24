'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Amiri, Poppins } from 'next/font/google';
import { useUser, type LangTrack } from '@/context/UserContext';
import LanguageSelector from '@/components/LanguageSelector';
import LottiePlayer from '@/components/LottiePlayer';
import { getTracks, type Track } from '@/lib/api';

const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-poppins' });

type TrackCard = {
  code: LangTrack;
  emoji: string;
  name: string;
  nameAr: string;
  tagline: string;
  description: string;
  color: string;
  shadow: string;
};

const TRACK_LOTTIE: Partial<Record<LangTrack, string>> = {
  MSA: 'puppy-reading.json',
  RELIGION: 'koran-ramadan.json',
};

const FALLBACK_CARDS: TrackCard[] = [
  {
    code: 'DARIJA', emoji: '🇲🇦', name: 'Darija', nameAr: 'الدَّارِجة',
    tagline: 'Parle comme un Marocain',
    description: 'Le dialecte du quotidien — famille, souk, rue. Audio authentique.',
    color: '#58cc02', shadow: '#46a302',
  },
  {
    code: 'MSA', emoji: '📖', name: 'Arabe standard', nameAr: 'الفُصْحى',
    tagline: 'Lis le monde arabe',
    description: "L'arabe littéraire moderne — presse, TV, textes. Harakat + translittération.",
    color: '#1cb0f6', shadow: '#0a8fc7',
  },
  {
    code: 'RELIGION', emoji: '☪︎', name: 'Religion', nameAr: 'الدِّين',
    tagline: 'Textes sacrés & tradition',
    description: 'Duas, vocabulaire du Coran, lieux saints. Découvre la tradition.',
    color: '#a855f7', shadow: '#7e3ed6',
  },
];

export default function Home() {
  const router = useRouter();
  const { setLangTrack } = useUser();
  const [cards, setCards] = useState<TrackCard[]>(FALLBACK_CARDS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tracks = (await getTracks()) as Track[];
        if (cancelled || !Array.isArray(tracks) || tracks.length === 0) return;
        const mapped = tracks
          .filter((t) => t.isPublished !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map<TrackCard>((t) => {
            const fb = FALLBACK_CARDS.find((c) => c.code === t.code);
            return {
              code: t.code as LangTrack,
              emoji: t.emoji || fb?.emoji || '📚',
              name: t.name,
              nameAr: t.nameAr || fb?.nameAr || '',
              tagline: fb?.tagline || '',
              description: t.description || fb?.description || '',
              color: t.color || fb?.color || '#58cc02',
              shadow: fb?.shadow || '#46a302',
            };
          });
        if (mapped.length) setCards(mapped);
      } catch { /* fallback */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const chooseTrack = (code: LangTrack) => {
    setLangTrack(code);
    router.push('/welcome');
  };

  return (
    <main className={`${amiri.variable} ${poppins.variable}`} style={{
      fontFamily: 'var(--font-poppins), sans-serif',
      backgroundColor: '#f8f5f0',
      color: '#1f2937',
      minHeight: '100vh',
    }}>
      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'calc(14px + env(safe-area-inset-top)) 28px 14px', background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, position: 'relative' }}>
            <Image src="/images/maroccan-lion.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'var(--font-amiri)', fontSize: 18, fontWeight: 700, color: '#111827' }}>أجي تهضر الدارجة</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.04em' }}>Aji Tahdar Darija</span>
          </div>
        </div>
        <LanguageSelector />
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: '40px 24px 40px', textAlign: 'center',
        maxWidth: 920, margin: '0 auto',
      }}>
        <div style={{ width: 220, height: 220, margin: '0 auto 10px' }}>
          <LottiePlayer src="joy-walking.json" size="100%" />
        </div>
        <span style={{
          display: 'inline-block', padding: '6px 14px', borderRadius: 999,
          background: '#fff', border: '1px solid #e5e7eb',
          fontSize: 12, fontWeight: 800, color: '#6b7280',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20,
        }}>3 parcours · 1 culture</span>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1,
          margin: '0 0 18px', color: '#111827',
        }}>
          L'arabe, <span style={{ color: '#58cc02' }}>version marocaine</span>.<br/>
          Parle, lis, <span style={{ color: '#a855f7' }}>prie</span>.
        </h1>
        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)', color: '#4b5563',
          maxWidth: 620, margin: '0 auto 28px', lineHeight: 1.5,
        }}>
          Choisis ton chemin — Darija pour la rue, arabe standard pour lire, textes religieux pour la tradition. Une seule app, trois parcours complets.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/welcome" style={{ textDecoration: 'none' }}>
            <button style={{
              background: '#58cc02', color: '#fff', border: 'none',
              borderRadius: 14, padding: '14px 28px',
              fontSize: 15, fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 4px 0 #46a302', textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}>
              Commencer gratuitement
            </button>
          </Link>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: '#fff', color: '#1cb0f6',
              border: '2px solid #e5e7eb',
              borderRadius: 14, padding: '14px 28px',
              fontSize: 15, fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 4px 0 #e5e7eb', textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}>
              J'ai déjà un compte
            </button>
          </Link>
        </div>
      </section>

      {/* ── 3 parcours ── */}
      <section style={{ padding: '24px 20px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{
            fontSize: 12, fontWeight: 900, color: '#9ca3af',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>Parcours</span>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900,
            margin: '6px 0 0', color: '#111827',
          }}>Quel chemin veux-tu prendre ?</h2>
        </div>

        <div className="tracks-grid">
          {cards.map((c) => (
            <button
              key={c.code}
              onClick={() => chooseTrack(c.code)}
              className="track-card"
              style={{
                background: '#fff',
                border: `3px solid ${c.color}`,
                borderRadius: 20,
                padding: '26px 22px 22px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: `0 6px 0 ${c.shadow}33`,
                display: 'flex', flexDirection: 'column', gap: 14,
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 14,
                  background: `${c.color}1a`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, overflow: 'hidden',
                }}>
                  {TRACK_LOTTIE[c.code] ? (
                    <LottiePlayer src={TRACK_LOTTIE[c.code]!} size={64} fallback={<span>{c.emoji}</span>} />
                  ) : (
                    <span>{c.emoji}</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', lineHeight: 1.1 }}>
                    {c.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-amiri)',
                    fontSize: 18, color: c.color, fontWeight: 700, marginTop: 2,
                  }}>{c.nameAr}</div>
                </div>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 900, color: c.color,
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>{c.tagline}</div>
              <p style={{
                fontSize: 14, color: '#4b5563', lineHeight: 1.5, margin: 0, flex: 1,
              }}>{c.description}</p>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 4, paddingTop: 14, borderTop: `1px dashed ${c.color}40`,
              }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#6b7280' }}>Explorer →</span>
                <span style={{ fontSize: 18, color: c.color, fontWeight: 900 }}>→</span>
              </div>
            </button>
          ))}
        </div>

        <style jsx>{`
          .tracks-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 18px;
          }
          @media (min-width: 720px) {
            .tracks-grid { grid-template-columns: repeat(3, 1fr); }
          }
          .track-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 0 rgba(0,0,0,0.08);
          }
        `}</style>
      </section>

      {/* ── Promesses chiffrées ── */}
      <section style={{
        background: '#fff', padding: '50px 20px',
        borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{
          maxWidth: 920, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 24, textAlign: 'center',
        }}>
          {[
            { n: '100+', l: 'Modules', c: '#58cc02' },
            { n: '2500+', l: 'Mots & expressions', c: '#1cb0f6' },
            { n: '28', l: 'Lettres (alphabet)', c: '#f59e0b' },
            { n: '3', l: 'Parcours complets', c: '#a855f7' },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 900, color: s.c, lineHeight: 1 }}>
                {s.n}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', marginTop: 6, letterSpacing: '0.02em' }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mascotte Simba ── */}
      <section style={{ padding: '60px 20px', maxWidth: 920, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 28,
          background: '#fff', padding: '28px 28px', borderRadius: 20,
          border: '1px solid #e5e7eb',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <div style={{ width: 140, height: 140, position: 'relative', flexShrink: 0 }}>
            <Image src="/images/maroccan-lion.png" alt="Simba" fill style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ flex: '1 1 280px', minWidth: 240 }}>
            <span style={{
              fontFamily: 'var(--font-amiri)', fontSize: 22, color: '#58cc02', fontWeight: 700,
            }}>مَرْحَبَا بِيك !</span>
            <h3 style={{ fontSize: 24, fontWeight: 900, margin: '6px 0 8px', color: '#111827' }}>
              Moi c'est Simba
            </h3>
            <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.5, margin: '0 0 14px' }}>
              Je suis ton guide, peu importe le parcours. Darija, standard ou religieux — on avance ensemble, sans prise de tête.
            </p>
            <Link href="/welcome" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#58cc02', color: '#fff', border: 'none',
                borderRadius: 12, padding: '10px 20px',
                fontSize: 14, fontWeight: 900, cursor: 'pointer',
                boxShadow: '0 3px 0 #46a302',
              }}>
                Suivre Simba →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Les 3 personnages ── */}
      <section style={{ padding: '20px 20px 60px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#111827', margin: 0 }}>
            Tes guides dans l'aventure
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {[
            { name: 'Yassine', img: '/images/maroccan-child-trans.png', msg: 'Salam, ana Yassine !', bubble: '#58cc02' },
            { name: 'Simba',   img: '/images/maroccan-lion.png',         msg: 'Yallah on commence !',   bubble: '#f59e0b' },
            { name: 'Nadia',   img: '/images/maroccan-girl-trans.png',   msg: 'Ana Nadia, marhaba !',   bubble: '#a855f7' },
          ].map((p) => (
            <div key={p.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 14, padding: 20, background: '#fff',
              borderRadius: 16, border: '1px solid #e5e7eb',
            }}>
              <div style={{
                background: p.bubble, color: '#fff',
                padding: '8px 14px', borderRadius: 16,
                fontSize: 13, fontWeight: 800,
                position: 'relative',
              }}>{p.msg}</div>
              <div style={{
                width: 120, height: 120, position: 'relative',
                borderRadius: '50%', overflow: 'hidden',
                background: '#f3f4f6',
              }}>
                <Image src={p.img} alt={p.name} fill style={{ objectFit: 'contain' }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{p.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pourquoi nous ── */}
      <section style={{
        background: '#fff', padding: '60px 20px',
        borderTop: '1px solid #e5e7eb',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{
              fontSize: 12, fontWeight: 900, color: '#9ca3af',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>Pourquoi nous</span>
            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900,
              margin: '6px 0 0', color: '#111827',
            }}>Une méthode qui marche</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}>
            {[
              { i: '🔊', t: 'Audio authentique', d: 'TTS marocain natif pour Darija, harakat pour MSA. Pas de sons robotiques académiques.' },
              { i: '🗺️', t: 'Apprentissage géographique', d: 'Chaque parcours traverse des villes — Maroc, monde arabe, monde musulman.' },
              { i: '🎮', t: 'Jeu et répétition', d: 'Exercices courts, feedback immédiat, reprise auto des erreurs. Zéro frustration.' },
              { i: '📲', t: 'Mobile-first', d: 'Dans le bus, à la cuisine, à la mosquée. Conçu pour le téléphone, exigeant sur desktop.' },
            ].map((w) => (
              <div key={w.t} style={{
                padding: 22, background: '#f8f5f0',
                borderRadius: 14, border: '1px solid #e5e7eb',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: 28 }}>{w.i}</div>
                <div>
                  <strong style={{ display: 'block', fontSize: 15, color: '#111827', marginBottom: 4 }}>{w.t}</strong>
                  <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5, margin: 0 }}>{w.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{
        background: 'linear-gradient(135deg, #58cc02 0%, #1cb0f6 50%, #a855f7 100%)',
        padding: '70px 20px', textAlign: 'center', color: '#fff',
      }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, margin: '0 0 10px' }}>
          Prêt à te lancer ?
        </h2>
        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: 0.95, margin: '0 0 24px' }}>
          3 parcours, 1 app, 0 abonnement. C'est parti.
        </p>
        <button onClick={() => router.push('/welcome')} style={{
          background: '#fff', color: '#111827', border: 'none',
          borderRadius: 14, padding: '16px 34px',
          fontSize: 16, fontWeight: 900, cursor: 'pointer',
          boxShadow: '0 4px 0 rgba(0,0,0,0.2)', textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          Yallah, on commence !
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#111827', color: '#fff', padding: '40px 20px 24px',
      }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
          alignItems: 'center', paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, position: 'relative' }}>
              <Image src="/images/maroccan-lion.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: 'var(--font-amiri)', fontSize: 18, fontWeight: 700 }}>أجي تهضر الدارجة</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Aji Tahdar Darija</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>À propos</Link>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Contact</Link>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Confidentialité</Link>
          </div>
        </div>
        <div style={{
          textAlign: 'center', marginTop: 20, fontSize: 12,
          color: 'rgba(255,255,255,0.5)',
        }}>
          © {new Date().getFullYear()} Aji Tahdar Darija. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}
