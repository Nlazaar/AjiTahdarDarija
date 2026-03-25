# VERSION

- Version actuelle : 1.1.0
- Date de release : 2026-03-25

## Changelog (v1.1.0)
- Backend : extension du domaine auth (DTO/strategies), ajout de nouveaux modules de progression et engagement (`quests`, `shop`), et évolution des contrôleurs/services (friends, lessons, progress, leaderboard, gamification).
- Data : ajout de scripts de seed pour le curriculum, les modules et la boutique, plus support Prisma associé.
- Web : mise à jour des pages clés (auth, conversation, friends, leaderboard, progress, lessons), refonte de composants d'exercices et amélioration de l'intégration API côté client.
- Architecture : ajout/mise à jour de la documentation d'architecture et du flow écran.

## Changelog (v1.0.0)
- Backend : API NestJS + Prisma, authentification JWT, validation globale, gestion d'erreurs uniforme, logging requêtes, rate limiter (auth), endpoints santé et métriques.
- Web : Next.js (App Router) avec `useApi`, ErrorBoundary, Loader, Toasts, client wrappers pour Progress/Profile, pages principales implémentées.
- Mobile : Expo app avec `useApi`, `useAuth`, composants d'exercices (MCQ, Traduction, Remplir, Écoute, Ordre des mots), flux de leçon/résultats, révision intelligente, gamification (XP, streaks, badges), UI de base et primitives (Loader, Toasts, Skeleton, ErrorBoundary).
- DevOps : Dockerfiles, configs Vercel/EAS/Railway, workflows GitHub Actions, `.env.example` et docs de déploiement.

## Roadmap

### V1.1 (patch / court terme)
- Ajouter tests unitaires et d'intégration critiques (auth, lessons, review).
- Remplacer health placeholder par check DB réel (Prisma).
- Durcir rate limiter (Redis) pour production.
- Corrections UI/UX mineures et nettoyage de code.

### V1.2 (améliorations)
- Améliorer l'import de contenu et l'éditeur de leçons.
- Offline sync et meilleure gestion réseau mobile.
- Analytics et tableaux de bord basiques.

### V2 (évolution majeure)
- Tutor IA / recommandations adaptatives.
- Plans payants, gestion des abonnements.
- Multi-langues complètes et contenu collaboratif.
