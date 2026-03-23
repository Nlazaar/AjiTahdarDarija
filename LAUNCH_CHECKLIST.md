# LAUNCH CHECKLIST

## Tests finaux
- Exécuter build complet : backend, web, mobile (EAS).
- Lancer suite de tests automatisés (unit & integration) et corriger erreurs.
- Tests manuels critiques : inscription, login, achat (si existant), leçon complète, révision.

## Vérification des endpoints
- Vérifier /health retourne OK et DB accessible.
- Vérifier /metrics fonctionne et collecte données.
- Tester endpoints critiques : /auth, /lessons/:id, /lessons/:id/submit, /analytics, /review.
- Vérifier permissions et rôles (admin pages protégées).

## Vérification des builds
- Web: `npm run build` sur `web` sans erreurs, vérifier bundle size et images optimisées.
- Backend: `npm run build` sur `backend`, exécuter smoke tests.
- Mobile: EAS build / run on device, vérifier assets (icons, splash), permissions audio.

## Vérification des stores
- Préparer assets Play Store / App Store (icônes, screenshots, description).
- Vérifier politique de confidentialité et contact de support inclus.
- Tester l'installation sur device via internal testing / TestFlight.

## Monitoring & alerting
- Vérifier metrics/Prometheus scrapping sur staging.
- Configurer alerting basique (erreurs > threshold, uptimes, rate limits).

## Post-launch
- Plan rollback / hotfix process.
- Rôles et contacts d'urgence (qui patch, qui release).
