'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ─── Dark theme ──────────────────────────────────────────────────────────── */
const BG     = 'var(--c-bg)';
const CARD   = 'var(--c-card)';
const CARD2  = 'var(--c-card2)';
const BORDER = 'var(--c-border)';
const TEXT   = 'var(--c-text)';
const SUB    = 'var(--c-sub)';
const GREEN  = '#58cc02';
const GOLD   = '#f59e0b';

const BENEFITS = [
  { icon: '❤️',  label: 'Cœurs illimités',              desc: 'Ne t\'arrête plus jamais pour manque de vies' },
  { icon: '🚫',  label: 'Zéro publicité',               desc: 'Apprends sans interruption' },
  { icon: '📚',  label: 'Accès à tous les modules',      desc: 'Débloque les 15 chapitres dès le départ' },
  { icon: '🔥',  label: 'Boosts de série',               desc: 'Protège ta série même si tu rates un jour' },
  { icon: '📊',  label: 'Statistiques avancées',         desc: 'Suivi détaillé de tes progrès' },
  { icon: '🎯',  label: 'Mode pratique illimité',        desc: 'Entraîne-toi sans limites sur tous les scénarios' },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'Mensuel',
    price: '4,99 €',
    period: '/ mois',
    sub: null,
    color: '#1cb0f6',
    shadow: '#1899d6',
    badge: null,
  },
  {
    id: 'yearly',
    label: 'Annuel',
    price: '39,99 €',
    period: '/ an',
    sub: '3,33 € / mois',
    color: GOLD,
    shadow: '#d97706',
    badge: 'Économisez 33 %',
  },
];

function ComingSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: CARD, borderRadius: 24,
          border: `1.5px solid ${BORDER}`,
          padding: '32px 28px', maxWidth: 360, width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔜</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: TEXT, marginBottom: 10 }}>
          Bientôt disponible
        </div>
        <div style={{ fontSize: 14, color: SUB, lineHeight: 1.6, marginBottom: 24 }}>
          Le paiement en ligne sera disponible très prochainement.
          En attendant, continue à apprendre gratuitement !
        </div>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '13px', borderRadius: 14,
            background: GREEN, border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 900, color: 'white',
            boxShadow: '0 4px 0 #3a8a01',
          }}
        >
          Continuer gratuitement
        </button>
      </div>
    </div>
  );
}

export default function AbonnementPage() {
  const [selected, setSelected] = useState<'monthly' | 'yearly'>('yearly');
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px', color: TEXT }}>
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}

      {/* Breadcrumb */}
      <div style={{ padding: '24px 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/settings" style={{ fontSize: 12, fontWeight: 700, color: '#1cb0f6', textDecoration: 'none' }}>
          PARAMÈTRES
        </Link>
        <span style={{ fontSize: 12, color: SUB }}>›</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: SUB }}>ABONNEMENT</span>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '32px 0 28px' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>⭐</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, marginBottom: 8 }}>
          Super Darija Maroc
        </h1>
        <p style={{ fontSize: 15, color: SUB, lineHeight: 1.5, maxWidth: 380, margin: '0 auto' }}>
          Apprends le Darija sans limites. Débloque toutes les fonctionnalités premium.
        </p>
      </div>

      {/* Benefits */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 13, fontWeight: 900, color: SUB, marginBottom: 12,
          textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Ce qui est inclus
        </h2>
        <div style={{
          background: CARD, borderRadius: 20,
          border: `1px solid ${BORDER}`, overflow: 'hidden',
        }}>
          {BENEFITS.map((b, i) => (
            <div key={b.label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 20px',
              borderBottom: i < BENEFITS.length - 1 ? `1px solid ${BORDER}` : 'none',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: CARD2, border: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {b.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>{b.label}</div>
                <div style={{ fontSize: 12, color: SUB, marginTop: 1 }}>{b.desc}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: GREEN, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: 'white', fontWeight: 900,
              }}>
                ✓
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <h2 style={{ fontSize: 13, fontWeight: 900, color: SUB, marginBottom: 12,
        textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Choisis ton plan
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {PLANS.map(plan => {
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id as 'monthly' | 'yearly')}
              style={{
                padding: '20px 16px', borderRadius: 20,
                border: `2px solid ${isSelected ? plan.color : BORDER}`,
                background: isSelected ? `${plan.color}12` : CARD,
                cursor: 'pointer', textAlign: 'center',
                position: 'relative', transition: 'all 0.15s',
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: GOLD, color: '#1a1a1a',
                  fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 20,
                  whiteSpace: 'nowrap', letterSpacing: '0.04em',
                }}>
                  {plan.badge}
                </div>
              )}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 20, height: 20, borderRadius: '50%',
                  background: plan.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: 'white', fontWeight: 900,
                }}>
                  ✓
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 900, color: isSelected ? plan.color : SUB,
                marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {plan.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: TEXT, lineHeight: 1 }}>
                {plan.price}
              </div>
              <div style={{ fontSize: 12, color: SUB, marginTop: 3 }}>{plan.period}</div>
              {plan.sub && (
                <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, marginTop: 6 }}>
                  {plan.sub}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          width: '100%', padding: '16px', borderRadius: 18,
          background: selected === 'yearly' ? GOLD : '#1cb0f6',
          border: 'none', cursor: 'pointer',
          color: selected === 'yearly' ? '#1a1a1a' : 'white',
          fontSize: 16, fontWeight: 900,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          boxShadow: `0 4px 0 ${selected === 'yearly' ? '#d97706' : '#1899d6'}`,
          transition: 'all 0.15s',
        }}
      >
        ⭐ S'abonner maintenant
      </button>

      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: SUB }}>
        Annulation possible à tout moment · Paiement sécurisé
      </div>

      {/* Free plan note */}
      <div style={{
        marginTop: 24, padding: '16px 20px', borderRadius: 16,
        background: CARD, border: `1px solid ${BORDER}`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: SUB, lineHeight: 1.5 }}>
          Continuer avec le plan <strong style={{ color: TEXT }}>Gratuit</strong> — accès aux premiers chapitres, 5 cœurs par session.
        </div>
        <Link href="/cours" style={{
          display: 'inline-block', marginTop: 10,
          fontSize: 12, fontWeight: 700, color: SUB, textDecoration: 'none',
        }}>
          Rester sur le plan gratuit →
        </Link>
      </div>
    </div>
  );
}
