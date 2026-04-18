# Base de données DarijaMaroc

**SGBD :** PostgreSQL
**ORM :** Prisma
**Schéma source :** [backend/prisma/schema.prisma](../backend/prisma/schema.prisma)

---

## Enums

### `ExerciseType`
Type d'exercice pédagogique.
- `MULTIPLE_CHOICE` — QCM
- `FILL_BLANK` — Texte à trous
- `LISTENING` — Écoute audio
- `TRANSLATION` — Traduction
- `REORDER` — Remise en ordre

### `PartOfSpeech`
Nature grammaticale d'un mot : `NOUN`, `VERB`, `ADJECTIVE`, `ADVERB`, `PRONOUN`, `PREPOSITION`, `CONJUNCTION`, `INTERJECTION`.

### `LangTrack`
Piste linguistique suivie par l'apprenant : `DARIJA`, `MSA`, `BOTH`.

---

## Tables principales

### `User` — Utilisateurs de l'application
Profil, authentification, progression et gamification.

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant unique |
| `email` | String (unique) | Email de connexion |
| `passwordHash` | String? | Hash bcrypt du mot de passe |
| `name` | String? | Nom affiché |
| `avatar` | String? | URL de l'avatar |
| `locale` | String (def. "fr") | Langue d'interface |
| `createdAt` / `updatedAt` | DateTime | Horodatages |
| `isDeleted` | Boolean | Soft-delete |
| `xp` | Int | Points d'expérience cumulés |
| `level` | Int | Niveau du joueur |
| `streak` | Int | Jours consécutifs de pratique |
| `lastStreakAt` | DateTime? | Dernière activité prise en compte pour le streak |
| `hearts` | Int (def. 5) | Vies restantes |
| `gemmes` | Int | Monnaie premium |
| `langTrack` | LangTrack | Piste choisie (Darija/MSA/Both) |
| `subscriptionStatus` | String? | `free` \| `premium` |
| `subscriptionExpiresAt` | DateTime? | Échéance de l'abonnement |

---

### `Language` — Langues enseignées
Référentiel des langues (Darija, MSA, français…).

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `code` | String (unique) | Code ISO (`ar-MA`, `fr`, `en`) |
| `name` | String | Libellé affiché |
| `createdAt` | DateTime | Date de création |

---

### `Module` — Modules de cours
Regroupe plusieurs leçons d'un même thème (ex. "Se présenter").

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `title` | String | Titre du module |
| `subtitle` | String? | Sous-titre |
| `description` | String? | Description longue |
| `level` | Int | Niveau de difficulté |
| `slug` | String (unique) | Slug URL |
| `colorA` / `colorB` / `shadowColor` | String? | Couleurs de la carte UI |
| `isPublished` | Boolean | Visible publiquement |
| `createdAt` / `updatedAt` | DateTime | Horodatages |

---

### `Lesson` — Leçons
Unité pédagogique contenant une suite d'exercices, optionnellement précédée d'une vidéo.

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `title` / `subtitle` / `description` | String(?) | Métadonnées |
| `slug` | String? (unique) | Slug URL |
| `content` | Json? | Blocs structurés (étapes, indices) |
| `order` | Int | Ordre dans le module |
| `duration` | Int? | Durée estimée (secondes) |
| `level` | Int | Niveau |
| `videoUrl` | String? | URL vidéo d'intro (MP4/YouTube/Vimeo) |
| `videoPoster` | String? | Miniature vidéo |
| `isPublished` | Boolean | Visible publiquement |
| `isDeleted` | Boolean | Soft-delete |
| `moduleId` | FK Module? | Module parent |
| `authorId` | FK User? | Auteur |
| `languageId` | FK Language | Langue cible |
| `createdAt` / `updatedAt` | DateTime | Horodatages |

---

### `Vocabulary` — Vocabulaire
Mots/expressions enseignés, avec audio, image et exemples.

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `word` | String | Mot en langue cible (arabe) |
| `transliteration` | String? | Translittération latine |
| `translation` | Json? | Traductions par langue |
| `audioUrl` | String? | URL MP3 (Habibi-TTS) |
| `imageUrl` | String? | Illustration |
| `partOfSpeech` | PartOfSpeech? | Nature grammaticale |
| `examples` | Json? | Exemples d'usage |
| `tags` | String[] | Tags de recherche |
| `languageId` | FK Language | Langue d'appartenance |
| `createdAt` / `updatedAt` | DateTime | Horodatages |

---

### `Exercise` — Exercices
Exercices rattachés à une leçon ou à un mot de vocabulaire.

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `type` | ExerciseType | Type d'exercice |
| `prompt` | String? | Énoncé |
| `data` | Json? | Options, réfs audio, mécanique PDF… |
| `answer` | Json? | Réponse canonique |
| `points` | Int (def. 10) | XP gagnés |
| `lessonId` | FK Lesson? | Leçon parente |
| `vocabularyId` | FK Vocabulary? | Mot lié |
| `createdAt` / `updatedAt` | DateTime | Horodatages |

---

### `Badge` — Badges disponibles

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `key` | String (unique) | Clé technique (`first_lesson`, `streak_7`…) |
| `title` | String | Nom affiché |
| `description` | String? | Description |
| `icon` | String? | URL/asset |
| `points` | Int | XP associés |
| `createdAt` | DateTime | Date de création |

---

## Tables de liaison / progression

### `UserBadge` — Badges obtenus
Pivot `User ↔ Badge` avec date d'attribution.

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | FK User | Utilisateur |
| `badgeId` | FK Badge | Badge |
| `awardedAt` | DateTime | Date d'obtention |

Contrainte : `@@unique([userId, badgeId])`

---

### `UserVocabulary` — Mémorisation du vocabulaire
Suivi SRS (spaced repetition) par utilisateur.

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | FK User | Utilisateur |
| `vocabularyId` | FK Vocabulary | Mot |
| `mastery` | Int (0-100) | Niveau de maîtrise |
| `lastSeenAt` | DateTime? | Dernière révision |
| `nextReviewAt` | DateTime? | Prochaine révision prévue |
| `createdAt` / `updatedAt` | DateTime | Horodatages |

Contrainte : `@@unique([userId, vocabularyId])`

---

### `UserProgress` — Progression par leçon

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | FK User | Utilisateur |
| `lessonId` | FK Lesson | Leçon |
| `completed` | Boolean | Terminée ? |
| `progress` | Int (0-100) | Pourcentage |
| `xpEarned` | Int | XP gagnés sur cette leçon |
| `startedAt` / `finishedAt` | DateTime(?) | Début / fin |
| `updatedAt` | DateTime | Dernière mise à jour |

Contrainte : `@@unique([userId, lessonId])`

---

### `AnalyticsEvent` — Événements analytics

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | String? | Utilisateur (optionnel) |
| `type` | String | Nom de l'événement |
| `payload` | Json? | Données associées |
| `createdAt` | DateTime | Horodatage |

---

### `FriendRequest` — Demandes d'amis

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `fromId` | String | Expéditeur |
| `toId` | String | Destinataire |
| `status` | String | `pending` \| `accepted` \| `rejected` |
| `createdAt` | DateTime | Date d'envoi |

---

### `LeagueMembership` — Appartenance aux ligues

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | String | Utilisateur |
| `league` | String | `Bronze` \| `Silver` \| `Gold` \| `Diamond` \| `Master` |
| `points` | Int | Points de ligue |
| `updatedAt` | DateTime | Dernière mise à jour |

---

### `VocabularyPack` — Packs de vocabulaire thématiques

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `title` | String | Titre du pack |
| `description` | String? | Description |
| `difficulty` | String? | `easy` \| `medium` \| `hard` |
| `category` | String? | Catégorie (voyages, famille…) |
| `premiumOnly` | Boolean | Réservé aux abonnés |
| `createdAt` | DateTime | Date de création |

---

### `PackWord` — Pivot Pack ↔ Vocabulaire

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `packId` | FK VocabularyPack | Pack |
| `vocabularyId` | FK Vocabulary | Mot |

---

### `ConversationMessage` — Historique chatbot

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | FK User? | Utilisateur |
| `role` | String | `user` \| `bot` |
| `text` | String | Contenu texte |
| `audioUrl` | String? | Audio associé |
| `createdAt` | DateTime | Horodatage |

---

### `ShopItem` — Articles de la boutique

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `key` | String (unique) | Clé technique |
| `name` | String | Nom affiché |
| `description` | String | Description |
| `icon` | String | Icône |
| `category` | String | `consumable` \| `cosmetic` \| `pack` |
| `price` | Int | Prix (gemmes) |
| `effect` | Json? | Effet appliqué (bonus XP, vies…) |
| `isAvailable` | Boolean | Disponible à l'achat |
| `createdAt` | DateTime | Date de création |

---

### `UserInventory` — Inventaire utilisateur

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | FK User | Propriétaire |
| `itemKey` | FK ShopItem.key | Article |
| `quantity` | Int | Quantité possédée |
| `isActive` | Boolean | Actuellement équipé/actif |
| `expiresAt` | DateTime? | Date d'expiration (consommables temporaires) |
| `createdAt` | DateTime | Date d'acquisition |

---

### `DailyQuestProgress` — Progression quêtes quotidiennes

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | String | Utilisateur |
| `date` | String | Jour `YYYY-MM-DD` |
| `questKey` | String | `xp_50` \| `lessons_2` \| `streak` \| `score_90` |
| `current` | Int | Avancement |
| `completed` | Boolean | Terminée ? |
| `claimedAt` | DateTime? | Date de réclamation de la récompense |
| `createdAt` | DateTime | Horodatage |

Contrainte : `@@unique([userId, date, questKey])`

---

### `MonthlyQuestProgress` — Progression quêtes mensuelles

| Colonne | Type | Description |
|---|---|---|
| `id` | String (cuid) | Identifiant |
| `userId` | String | Utilisateur |
| `yearMonth` | String | Mois `YYYY-MM` |
| `questsDone` | Int | Quêtes journalières accomplies dans le mois |
| `questsTarget` | Int (def. 30) | Objectif mensuel |
| `completed` | Boolean | Terminée ? |
| `claimedAt` | DateTime? | Date de réclamation |
| `createdAt` | DateTime | Horodatage |

Contrainte : `@@unique([userId, yearMonth])`

---

## Vue d'ensemble des relations

```
User ──┬── UserProgress ── Lesson ── Module
       ├── UserVocabulary ── Vocabulary ── Language
       ├── UserBadge ── Badge
       ├── UserInventory ── ShopItem
       ├── ConversationMessage
       └── (lessonsAuthored) Lesson

Lesson ── Exercise ── Vocabulary
VocabularyPack ── PackWord ── Vocabulary
```
