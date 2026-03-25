# RELEASE NOTES — V1.1.0

## Résumé
La version 1.1.0 apporte une extension fonctionnelle importante du backend (auth, quêtes, boutique, progression) et une mise à niveau de l'expérience web (pages, composants d'exercices, navigation, intégration API), avec des scripts de seed supplémentaires pour accélérer la mise en place des données.

## Fonctionnalités incluses
- Backend : enrichissement du module auth (DTO, stratégies), ajustements transverses des contrôleurs/services, et nouveaux modules `quests` et `shop`.
- Backend data : ajout de scripts de seed (`seedCurriculum`, `seedModules`, `seedShop`) et fichier de seed Prisma.
- Web app : évolution des pages auth, lesson, progress, leaderboard, friends, conversation et de la mise en page globale.
- Web components : amélioration des composants UI et des composants d'exercices (feedback, options, audio, cartes d'exercice, flux de progression).
- Architecture : ajout/actualisation de la documentation architecture et des flux écran.

## Limitations connues
- Les artifacts de build front (`.next`) ne doivent pas être versionnés dans les commits de release.
- La couverture de tests reste à renforcer sur les nouveaux parcours (`quests`, `shop`, progression web).
- Le hardening production (rate limiting distribué, checks santé DB complets) doit être poursuivi.

## Prochaines étapes
- Ajouter des tests d'intégration backend pour les modules ajoutés en v1.1.0.
- Renforcer la validation produit du parcours de progression et des exercices côté web.
- Finaliser le nettoyage des fichiers générés et normaliser les règles de commit.
