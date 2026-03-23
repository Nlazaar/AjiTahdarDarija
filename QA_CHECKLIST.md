# QA CHECKLIST — Préparation V1

## Tests manuels (généraux)
- Installer et lancer backend, web et mobile.
- Créer un compte utilisateur, se connecter, déconnexion.
- Parcourir flux : accueil → lesson → répondre → résultat.
- Parcourir flux révision : récupérer items → répondre → soumettre → afficher résultats.
- Vérifier gamification : XP affiché, badges, streaks après actions.
- Tester erreurs réseau (mode avion) et reprise après reconnection.

## Tests API
- Auth : inscription, connexion, refresh token (si implémenté), 401 flows.
- Lessons : GET lesson, POST submit, validation payloads.
- Review : GET review items, POST submitReview, structure des réponses.
- Health & Metrics : /health retourne statut et /metrics accessible (si protégé, vérifier authentification).
- Rate limit : vérifier blocage sur endpoint `/auth` en cas de surcharge.

## Tests UI
- Vérifier affichage sur différentes tailles d'écran (mobile / tablet / desktop).
- Accessibility : labels des boutons, taille de texte, contrastes.
- Vérifier loader / skeleton / error states partout.
- Vérifier toasts affichés pour succès/erreur.

## Tests Mobile (Expo)
- Lancer sur simulateur iOS/Android et appareil réel.
- Tester permissions audio (pour exercices d'écoute).
- Tester stockage token (AsyncStorage) et comportement après kill/restart.
- Tester deep links / expo-router navigation.
- Vérifier gestion offline et file d'attente des soumissions.

## Tests de performance
- Mesurer temps de réponse API pour endpoints critiques (auth, lesson submit).
- Mesurer bundle size web et lazy-load composants lourds.
- Vérifier consommation CPU/mémoire sur mobile lors d'exercices lourds.

## Tests de sécurité
- Vérifier injections: valider tous les inputs côté backend (class-validator).
- Vérifier protection d'endpoint (JWT), expéditeur et scopes.
- Scanner dépendances vulnérables (`npm audit` / Snyk).
- Vérifier rate limiting et bruteforce sur endpoint auth.
