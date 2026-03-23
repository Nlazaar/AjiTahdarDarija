# RELEASE NOTES — V1.0.0

## Résumé
La version 1.0.0 publie la première édition fonctionnelle de l'application d'apprentissage: backend API, applications web et mobile (Expo), flux de leçons et de révision, et primitives de gamification.

## Fonctionnalités incluses
- Authentification JWT (inscription / connexion).
- API backend REST (NestJS + Prisma) avec validation et gestion d'erreurs uniforme.
- Web client (Next.js) : pages principales, `useApi`, ErrorBoundary, toasts.
- Mobile client (Expo) : exercices (MCQ, traduction, remplissage, écoute, ordre des mots), flux de leçon, révision intelligente, gamification (XP, badges), primitives UI (Loader, Skeleton, Toasts, ErrorBoundary).
- Observabilité : logging des requêtes, endpoint `/metrics` et `/health` (placeholder).
- Déploiement : Dockerfiles, configurations CI (GitHub Actions), guides de déploiement pour Vercel / Railway / EAS.

## Limitations connues
- Health endpoint est encore un placeholder et ne vérifie pas la connectivité réelle à la DB.
- Rate limiter en mémoire (non adapté au scaling horizontal) — prévoir Redis en production.
- Tests unitaires et d'intégration encore partiels — couverture à renforcer.
- Certaines réponses API (scoring/gamification) peuvent nécessiter des ajustements suivant le backend.

## Prochaines étapes
- Remplacer health placeholder avec checks Prisma.
- Ajouter tests critiques et automatiser dans CI.
- Déployer et valider monitoring en staging (metrics, alerting).
- Améliorer la tolérance réseau mobile (offline sync) et préparer V1.1.
