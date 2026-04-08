"use client";
import Link from "next/link";

const LAST_UPDATED = "8 avril 2026";
const CONTACT_EMAIL = "contact@ajitahdardarija.com";
const APP_NAME = "AjiTahdar Darija";

export default function PrivacyPage() {
  return (
    <div style={{
      maxWidth: "780px", margin: "0 auto", padding: "40px 24px 80px",
      color: "var(--c-text)", lineHeight: "1.75",
    }}>
      <Link href="/" style={{ color: "var(--c-sub)", fontSize: "14px", textDecoration: "none" }}>
        ← Retour
      </Link>

      <h1 style={{ fontSize: "28px", fontWeight: "900", marginTop: "24px", marginBottom: "8px" }}>
        Politique de confidentialité
      </h1>
      <p style={{ color: "var(--c-sub)", fontSize: "14px", marginBottom: "40px" }}>
        Dernière mise à jour : {LAST_UPDATED}
      </p>

      <Section title="1. Qui sommes-nous ?">
        <p>
          <strong>{APP_NAME}</strong> est une application d'apprentissage de la Darija marocaine.
          Le responsable du traitement est l'éditeur de l'application joignable à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--c-accent, #1cb0f6)" }}>{CONTACT_EMAIL}</a>.
        </p>
      </Section>

      <Section title="2. Données collectées">
        <ul>
          <li><strong>Compte</strong> : adresse email, nom d'affichage, avatar (lors de l'inscription)</li>
          <li><strong>Progression</strong> : leçons terminées, score XP, streak, cœurs, niveaux</li>
          <li><strong>Exercices</strong> : réponses aux exercices, résultats de quiz (anonymisés après 90 jours)</li>
          <li><strong>Chatbot</strong> : messages saisis dans la conversation (conservés 90 jours puis supprimés)</li>
          <li><strong>Analytique</strong> : événements d'usage anonymisés (ouverture de leçon, complétion, etc.) conservés 90 jours</li>
          <li><strong>Paiement</strong> : géré exclusivement par Stripe — nous ne stockons jamais vos informations bancaires</li>
        </ul>
      </Section>

      <Section title="3. Finalité du traitement">
        <ul>
          <li>Fournir le service d'apprentissage et suivi de votre progression</li>
          <li>Personnaliser le contenu pédagogique (gamification, recommandations)</li>
          <li>Améliorer l'application via des statistiques d'usage agrégées</li>
          <li>Gérer les abonnements et paiements</li>
          <li>Répondre à vos demandes de support</li>
        </ul>
      </Section>

      <Section title="4. Base légale">
        <p>
          Le traitement est fondé sur l'exécution d'un contrat (CGU) pour les données nécessaires
          au service, et sur votre consentement pour les communications marketing éventuelles.
        </p>
      </Section>

      <Section title="5. Conservation des données">
        <ul>
          <li>Compte actif : pendant toute la durée d'utilisation</li>
          <li>Après suppression du compte : anonymisation immédiate des données PII, suppression sous 30 jours</li>
          <li>Analytique &amp; messages chatbot : suppression automatique après 90 jours</li>
          <li>Données de facturation : conservées 10 ans conformément aux obligations légales</li>
        </ul>
      </Section>

      <Section title="6. Vos droits (RGPD)">
        <p>Conformément au Règlement (UE) 2016/679, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Accès</strong> : obtenir une copie de vos données personnelles</li>
          <li><strong>Rectification</strong> : corriger vos informations inexactes</li>
          <li><strong>Suppression</strong> : demander la suppression de votre compte et données</li>
          <li><strong>Portabilité</strong> : recevoir vos données dans un format lisible</li>
          <li><strong>Opposition</strong> : s'opposer à certains traitements</li>
        </ul>
        <p>
          Pour exercer ces droits : <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--c-accent, #1cb0f6)" }}>{CONTACT_EMAIL}</a>
          {" "}ou via les paramètres de votre compte (Profil → Supprimer mon compte).
        </p>
      </Section>

      <Section title="7. Partage des données">
        <p>Vos données ne sont jamais vendues. Elles peuvent être partagées avec :</p>
        <ul>
          <li><strong>Stripe</strong> (paiements) — soumis au RGPD</li>
          <li><strong>Railway / Vercel</strong> (hébergement) — serveurs UE/US avec garanties adéquates</li>
          <li><strong>Anthropic</strong> (chatbot IA) — messages envoyés pour génération de réponses uniquement</li>
        </ul>
      </Section>

      <Section title="8. Cookies et stockage local">
        <p>
          Nous utilisons le <strong>localStorage</strong> pour mémoriser vos préférences (thème, langue, mascotte)
          et un <strong>cookie de session</strong> pour maintenir votre connexion.
          Ces cookies sont strictement nécessaires au fonctionnement du service et ne nécessitent pas de consentement préalable.
        </p>
      </Section>

      <Section title="9. Sécurité">
        <p>
          Vos données sont transmises via HTTPS. Les mots de passe sont hachés avec bcrypt.
          Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données.
        </p>
      </Section>

      <Section title="10. Contact et réclamations">
        <p>
          Pour toute question : <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--c-accent, #1cb0f6)" }}>{CONTACT_EMAIL}</a>
        </p>
        <p>
          Vous avez également le droit de déposer une réclamation auprès de la{" "}
          <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) :
          {" "}<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--c-accent, #1cb0f6)" }}>www.cnil.fr</a>
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "32px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "12px", color: "var(--c-text)" }}>
        {title}
      </h2>
      <div style={{ color: "var(--c-sub, #6b7f8a)", fontSize: "15px" }}>
        {children}
      </div>
    </section>
  );
}
