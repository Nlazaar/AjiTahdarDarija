'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ─── FAQ data ─────────────────────────────────────────────────────────────── */
const FAQ: { category: string; color: string; items: { q: string; a: string }[] }[] = [
  {
    category: 'Utiliser Darija Maroc',
    color: '#58cc02',
    items: [
      {
        q: 'Comment fonctionne l\'application ?',
        a: 'Darija Maroc est une application d\'apprentissage du dialecte marocain (Darija). Tu progresses à travers des modules thématiques — alphabet, salutations, chiffres, couleurs… — en réalisant des exercices variés : choix multiples, cartes mémoire, dictées, associations de lettres.',
      },
      {
        q: 'C\'est quoi une série ?',
        a: 'Ta série (🔥) représente le nombre de jours consécutifs où tu as complété au moins une leçon. C\'est une façon de t\'encourager à pratiquer chaque jour. Si tu rates un jour, ta série repart de zéro !',
      },
      {
        q: 'Comment fonctionnent les ligues et les divisions ?',
        a: 'Les ligues sont basées sur ton XP total : Bronze (0–999 XP), Argent (1 000–1 999), Or (2 000–4 999), Diamant (5 000–9 999), Master (10 000+). Plus tu accumules de XP en complétant des leçons, plus tu montes en ligue.',
      },
      {
        q: 'Comment gagner de l\'XP ?',
        a: 'Tu gagnes de l\'XP en complétant des exercices et des leçons. Chaque exercice correct rapporte des points. Les leçons complètes rapportent un bonus.',
      },
      {
        q: 'À quoi servent les cœurs ❤️ ?',
        a: 'Les cœurs représentent tes vies. Tu en perds un à chaque mauvaise réponse. Si tu n\'as plus de cœurs, tu dois attendre ou pratiquer pour en regagner.',
      },
    ],
  },
  {
    category: 'Gérer mon compte',
    color: '#1cb0f6',
    items: [
      {
        q: 'Comment changer mon nom d\'utilisateur ?',
        a: 'Pour l\'instant, le nom d\'utilisateur est défini lors de l\'inscription. La possibilité de le modifier sera disponible dans une prochaine mise à jour.',
      },
      {
        q: 'Comment ajouter des amis ?',
        a: 'Va dans la section Amis (accessible depuis le menu), puis l\'onglet "Rechercher". Tu peux chercher par nom ou adresse e-mail et envoyer une demande d\'ami.',
      },
      {
        q: 'Comment supprimer mon compte ?',
        a: 'Pour supprimer ton compte, contacte-nous à l\'adresse support@darijamaroc.com en indiquant ton adresse e-mail d\'inscription.',
      },
      {
        q: 'J\'ai oublié mon mot de passe, que faire ?',
        a: 'La réinitialisation de mot de passe par e-mail sera disponible prochainement. En attendant, contacte notre support.',
      },
    ],
  },
  {
    category: 'Leçons et exercices',
    color: '#ff9600',
    items: [
      {
        q: 'Dans quel ordre dois-je faire les leçons ?',
        a: 'Les leçons sont organisées en modules progressifs. Il est conseillé de les suivre dans l\'ordre — chaque module s\'appuie sur les précédents. Commence par l\'alphabet avant les salutations, puis les chiffres et couleurs.',
      },
      {
        q: 'Puis-je refaire une leçon déjà complétée ?',
        a: 'Oui ! Tu peux refaire n\'importe quelle leçon autant de fois que tu veux pour consolider tes connaissances et gagner plus d\'XP.',
      },
      {
        q: 'Les exercices sont-ils toujours les mêmes ?',
        a: 'Chaque leçon contient une variété d\'exercices (choix de lettre, vrai/faux, flashcards, dictées, associations…). L\'ordre peut varier pour rendre l\'apprentissage plus dynamique.',
      },
    ],
  },
  {
    category: 'Problèmes techniques',
    color: '#ff4b4b',
    items: [
      {
        q: 'L\'application ne charge pas, que faire ?',
        a: 'Vérifie ta connexion internet, puis essaie de rafraîchir la page. Si le problème persiste, vide le cache de ton navigateur ou contacte notre support.',
      },
      {
        q: 'Mon XP n\'a pas été enregistré après une leçon.',
        a: 'L\'XP est synchronisé avec notre serveur. En cas de problème de connexion, il se peut que la synchronisation soit retardée. Vérifie ta connexion et actualise la page.',
      },
      {
        q: 'Le son ne fonctionne pas lors des exercices.',
        a: 'Assure-toi que le son de ton appareil n\'est pas coupé. Tu peux aussi vérifier dans Paramètres que les "Effets sonores" et "Exercices de compréhension orale" sont activés.',
      },
    ],
  },
];

/* ─── Accordion item ──────────────────────────────────────────────────────── */
function AccordionItem({ q, a, isLast }: { q: string; a: string; isLast: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1.5px solid #f3f4f6' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', gap: 12,
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', flex: 1, lineHeight: 1.4 }}>
          {q}
        </span>
        <span style={{
          fontSize: 14, color: '#9ca3af', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}>
          ▾
        </span>
      </button>

      {open && (
        <div style={{
          padding: '0 20px 16px',
          fontSize: 14, color: '#6b7280', lineHeight: 1.6, fontWeight: 600,
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function AidePage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>

      {/* Breadcrumb */}
      <div style={{ padding: '24px 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/settings" style={{ fontSize: 12, fontWeight: 700, color: '#1cb0f6', textDecoration: 'none' }}>
          PARAMÈTRES
        </Link>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>›</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af' }}>CENTRE D'AIDE</span>
      </div>

      {/* Title */}
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 24 }}>
        Foire aux questions
      </h1>

      {/* FAQ sections */}
      {FAQ.map(section => (
        <div key={section.category} style={{ marginBottom: 20 }}>
          {/* Section header */}
          <div style={{
            background: 'white', borderRadius: '20px 20px 0 0',
            borderTop: '2px solid #f0f0f0', borderLeft: '2px solid #f0f0f0', borderRight: '2px solid #f0f0f0',
            padding: '16px 20px',
            borderBottom: `3px solid ${section.color}20`,
          }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: section.color }}>
              {section.category}
            </span>
          </div>

          {/* Items */}
          <div style={{
            background: 'white',
            borderRadius: '0 0 20px 20px',
            border: '2px solid #f0f0f0',
            borderTop: 'none',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          }}>
            {section.items.map((item, i) => (
              <AccordionItem
                key={i}
                q={item.q}
                a={item.a}
                isLast={i === section.items.length - 1}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Contact CTA */}
      <div style={{
        background: 'white', borderRadius: 20, padding: '24px',
        border: '2px solid #f0f0f0', textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginTop: 8,
      }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📧</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#111827', marginBottom: 6 }}>
          Tu n'as pas trouvé ta réponse ?
        </div>
        <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
          Notre équipe répond sous 24h.
        </div>
        <a
          href="mailto:support@darijamaroc.com"
          style={{
            display: 'inline-block', padding: '12px 28px', borderRadius: 14,
            background: '#111827', color: 'white',
            fontSize: 13, fontWeight: 800, textDecoration: 'none',
          }}
        >
          Nous contacter
        </a>
      </div>
    </div>
  );
}
