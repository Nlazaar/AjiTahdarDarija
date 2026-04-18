# TODO V1

## Tâches restantes (prioritaires)
- [HIGH] Remplacer le health endpoint placeholder par un vrai check Prisma/DB.
- [HIGH] Ajouter tests unitaires/integration pour l'auth, l'envoi de leçon et la révision.
- [HIGH] Exécuter build & lint complet pour backend/web/mobile et corriger erreurs.
- [HIGH] Durcir le rate limiter (Redis) et préparer la config infra.
- [MEDIUM] Finaliser les écrans `loading`/`error` sur le web (App Router) et mobile.
- [MEDIUM] Compléter les pages web manquantes et wrappers client supplémentaires.
- [MEDIUM] Nettoyage de code: ESLint autofix, suppression de logs inutiles.
- [LOW] Ajouter plus de contenus (leçons, vocabulaire) et importer automatiquement.

## Priorités
- Urgent: stabilité backend (DB checks, tests), CI pipelines vertes.
- Important: expérience mobile (offline, fiabilité réseau), tests critiques.
- Amélioration: analytics, contenu et onboarding.

## Bugs connus
- Rate limiter en mémoire (non adapté pour scaling horizontal).
- Health endpoint retourne un placeholder (ne vérifie pas DB).
- Quelques warnings TypeScript / linter ponctuels après récents changements mobile.
- Contrats API : certaines réponses de scoring/gamification peuvent varier selon backend.

## Améliorations futures
- Support offline complet + sync (expo + service workers web).
- Dashboard d'analytics et export CSV.
- Editeur interne de leçons + import CSV/Anki.
- A/B testing pour flow de révision.
