'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Amiri, Poppins } from 'next/font/google';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import styles from './Home.module.css';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
});

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <main className={`${styles.page} ${amiri.variable} ${poppins.variable}`}>

      {/* 1. Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <div style={{ width: 40, height: 40, position: 'relative' }}>
            <Image src="/images/maroccan-lion.png" alt="Logo" fill objectFit="contain" />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>أجي تهضر الدارجة</span>
            <span className={styles.logoSubtitle}>Aji Tahdar Darija</span>
          </div>
        </div>

        <div className={styles.navActions}>
          {/* THE 3 UNTOUCHABLE ELEMENTS (Language + 2 Buttons) */}
          <div className="nav-lang-fix" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <LanguageSelector />
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .nav-lang-fix > div:first-child {
          position: relative !important;
          top: 0 !important;
          right: 0 !important;
          z-index: 1001 !important;
        }
        @media (max-width: 480px) {
          .nav-lang-fix {
            justify-content: center !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* 2. Hero */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h2 className={styles.mainTitle}>Parle le <span>Darija</span> comme un Marocain</h2>
        </div>

        <div className={styles.heroCenter}>
          <div className={styles.heroImage} style={{ width: 240, height: 240, position: 'relative' }}>
            <Image
              src="/images/groupe_speak.jpg"
              alt="Groupe Speak"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <p className={styles.heroSlogan}>Apprendre où tu veux, quand tu veux</p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
            <Link href="/welcome" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#58cc02',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #46a302',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>
                {t.common.getStarted}
              </button>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: 'white',
                color: '#1cb0f6',
                border: '2px solid #e5e5e5',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #e5e5e5',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>
                {t.common.alreadyHaveAccount}
              </button>
            </Link>
          </div>
        </div>

        <div className={styles.heroRight}>
          <p className={styles.description}>
            Apprends l'arabe marocain du quotidien — alphabet, mots, expressions
          </p>
        </div>
      </section>

      {/* 3. Promo Section */}
      <section className={styles.promoSection}>
        {/* Row 1: Calligraphie Aji (Shadowed) */}
        <div className={styles.promoIconsRow}>
          <div className={styles.promoIconCard}>
            <div className={styles.circularImageWrapper}>
              <Image 
                src="/images/y1bgzmy1bgzmy1bg.png" 
                alt="Aji Tahdar Darija" 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Promo Details */}
        <div className={styles.promoIconsRow}>
          {/* Icon 2: 28 Alphabet */}
          <div className={styles.promoIconCard}>
            <div className={styles.circularImageWrapper}>
              <Image 
                src="/images/28_alphabet.jpg" 
                alt="28 Lettres" 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>28 LETTRES</h3>
          </div>

          {/* Icon 3: 1000 Mots & Phrases */}
          <div className={styles.promoIconCard}>
            <div className={styles.circularImageWrapper}>
              <Image 
                src="/images/1000_mots_phrases.jpg" 
                alt="1000+ Mots et Phrases" 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>1000+ MOTS & PHRASES</h3>
          </div>

          {/* Icon 4: 60 Modules */}
          <div className={styles.promoIconCard}>
            <div className={styles.circularImageWrapper}>
              <Image 
                src="/images/60_modules.jpg" 
                alt="Plus de 60 Modules" 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>+60 MODULES</h3>
          </div>
        </div>
      </section>


      {/* 5. Grille des modules */}
      <section className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Programme</span>
          <h2 className={styles.sectionTitle}>Tout le Darija, étape par étape</h2>
          <p className={styles.sectionIntro}>Du débutant à l'oral fluide</p>
        </div>
        <div className={styles.modulesGrid}>
          {/* Module 1: Alphabet */}
          <div className={styles.moduleCard} onClick={() => router.push('/lecons/alphabet')} style={{ cursor: 'pointer' }}>
            <div style={{ width: 240, height: 240, position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
              <Image
                src="/images/abj.jpg"
                alt="Alphabet"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>Alphabet</h3>
            <span className={`${styles.moduleBadge} ${styles.badgeGreen}`}>28 lettres + sons Disponibles</span>
          </div>

          {/* Module 2: Expressions */}
          <div className={styles.moduleCard}>
            <div style={{ width: 240, height: 240, position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
              <Image
                src="/images/expression_salutation.jpg"
                alt="Expressions"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>Expressions & Salutations</h3>
            <span className={`${styles.moduleBadge} ${styles.badgeAmber}`}>Populaire</span>
          </div>

          {/* Module 3: Vocabulaire */}
          <div className={styles.moduleCard}>
            <div style={{ width: 240, height: 240, position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
              <Image
                src="/images/mots_quotidiens.jpg"
                alt="Vocabulaire"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>Vocabulaire : Mots au quotidien</h3>
          </div>

          {/* Module 4: Famille */}
          <div className={styles.moduleCard}>
            <div style={{ width: 240, height: 240, position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
              <Image
                src="/images/famille_relation.jpg"
                alt="Famille"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>Famille & Relations</h3>
          </div>

          {/* Module 5: Cuisine */}
          <div className={styles.moduleCard}>
            <div style={{ width: 240, height: 240, position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
              <Image
                src="/images/cuisine_ingredients.jpg"
                alt="Cuisine"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>Cuisine : Plats & Ingrédients</h3>
          </div>

          {/* Module 6: Culture */}
          <div className={styles.moduleCard}>
            <div style={{ width: 240, height: 240, position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
              <Image
                src="/images/Culture_Proverbes.jpg"
                alt="Culture & Proverbes"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3>Culture & Proverbes</h3>
          </div>
        </div>
      </section>

      {/* 7. Section mascotte */}
      <section className={styles.sectionContainer}>
        <div className={styles.mascotSection}>
          <div style={{ width: 120, height: 120, position: 'relative' }} className={styles.mascotImage}>
            <Image src="/images/maroccan-lion.png" alt="Simba" fill objectFit="cover" />
          </div>
          <div className={styles.mascotContent}>
            <span className={styles.arabicGreet}>مرحبا بيك !</span>
            <h3>Moi c'est Simba</h3>
            <p>Je serai ton guide pour apprendre le Darija en t'amusant.</p>
            <button className={styles.ctaBtn} style={{ padding: '8px 20px', fontSize: 14, width: 'fit-content' }}>Suivre Simba →</button>
          </div>
        </div>
      </section>

      {/* 8. Section personnages */}
      <section className={styles.sectionContainer}>
        <div className={styles.charactersSection}>
          <h2 className={styles.sectionTitle}>Tes guides dans cette aventure</h2>
          <div className={styles.charactersGrid}>
            <div className={styles.charBox}>
              <div className={styles.bubble}>Salam, ana Yassine !</div>
              <div className={styles.charCircle}>
                <Image src="/images/maroccan-child-trans.png" alt="Yassine" fill objectFit="contain" />
              </div>
            </div>
            <div className={styles.charBox}>
              <div className={styles.bubble}>Yallah on commence !</div>
              <div className={styles.charCircle}>
                <Image src="/images/maroccan-lion.png" alt="Simba" fill objectFit="cover" />
              </div>
            </div>
            <div className={styles.charBox}>
              <div className={styles.bubble}>Ana Nadia, marhaba !</div>
              <div className={styles.charCircle}>
                <Image src="/images/maroccan-girl-trans.png" alt="Nadia" fill objectFit="contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Section "Pourquoi nous" */}
      <section className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>POURQUOI NOUS ?</h2>
          <p className={styles.sectionIntro}>Une méthode qui fonctionne</p>
        </div>
        <div className={styles.whyUsGrid}>
          <div className={styles.whyCard}>
            <span className={styles.whyIcon}>🔊</span>
            <div className={styles.whyText}>
              <strong>Prononciation native</strong>
              <p>Web Speech API en arabe marocain — sons authentiques, pas académiques.</p>
            </div>
          </div>
          <div className={styles.whyCard}>
            <span className={styles.whyIcon}>🎉</span>
            <div className={styles.whyText}>
              <strong>Apprentissage par le jeu</strong>
              <p>Exercices courts, feedback immédiat, reprise des erreurs automatique.</p>
            </div>
          </div>
          <div className={styles.whyCard}>
            <span className={styles.whyIcon}>📲</span>
            <div className={styles.whyText}>
              <strong>Mobile first</strong>
              <p>Dans le bus, à la cuisine, partout. Conçu pour le téléphone.</p>
            </div>
          </div>
          <div className={styles.whyCard}>
            <span className={styles.whyIcon}>🇲🇦</span>
            <div className={styles.whyText}>
              <strong>100% Marocain</strong>
              <p>Vocabulaire de la rue, vivant et actuel. Fait avec amour pour le Maroc.</p>
            </div>
          </div>
        </div>
      </section>
      {/* 10. CTA final */}
      <section className={styles.finalCTA}>
        <h2 style={{ fontSize: 36, fontWeight: 900 }}>Prêt à parler Darija ?</h2>
        <p style={{ opacity: 0.9, fontSize: 18 }}>Rejoins des centaines d'apprenants — c'est gratuit, c'est fun !</p>
        <button className={styles.ctaBtn} onClick={() => router.push('/welcome')}>Yallah, on commence !</button>
      </section>

      {/* 11. Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.navLogo}>
            <div style={{ width: 40, height: 40, position: 'relative' }}>
              <Image src="/images/maroccan-lion.png" alt="Logo" fill objectFit="contain" />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle} style={{ color: 'white' }}>أجي تهضر الدارجة</span>
              <span className={styles.logoSubtitle} style={{ color: 'rgba(255,255,255,0.6)' }}>Aji Tahdar Darija</span>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>À propos</Link>
            <Link href="/" className={styles.footerLink}>Contact</Link>
            <Link href="/" className={styles.footerLink}>Confidentialité</Link>
          </div>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Aji Tahdar Darija. Tous droits réservés.
        </div>
      </footer>

      {/* STYLES SHARED COMPONENT INLINE (as requested for untouchable elements logic if needed) */}
      <style jsx global>{`
        body {
          margin: 0;
          font-family: var(--font-poppins), sans-serif;
          background-color: #f8f5f0;
        }
      `}</style>
    </main>
  );
}
