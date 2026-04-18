# ONBOARDING — Comment gérer le contenu

## Importer du contenu
- Utiliser le script d'import `backend/scripts/importContent.js` pour importer CSV/JSON.
- Préparer un fichier CSV/JSON avec colonnes attendues (word, translation, partOfSpeech, tags).
- Exécuter: `cd backend && node scripts/importContent.js --file path/to/file`.

## Créer une leçon
- Dans l'admin (ou via API): POST `/lessons` avec `title`, `moduleId`, `content` (JSON blocks), `exercises`.
- Structure recommandée: steps séquentiels, chaque step contient `prompt`, `type`, `data`.

## Gérer les modules
- Créer/éditer modules via `/modules` endpoints.
- Associer lessons à un module via `moduleId`.
- Publier/unpublish en réglant `isPublished`.

## Gérer les badges
- Ajouter badge via `/badges` (key, title, description, points).
- Attribuer badge manuellement via `/user-badges` si nécessaire.
- Automatiser attribution dans `gamification.service` lors d'événements (xp threshold, streaks).

## Bonnes pratiques
- Garder le contenu granular (leçons courtes 3–7 min).
- Ajouter audio séparé pour les exercices d'écoute et stocker référence dans `exercise.data`.
- Versionner les imports et conserver backups.
