# Récap session autonome — DarijaMaroc
**Date :** 2026-04-16 · **Scope :** réorganisation pédagogique + gamification différenciante + optimisation DB + UI des nouvelles mécaniques

---

## 1. Base de données — modèle relationnel complet

### Ce qui a changé
- **Nouveau enum `ModuleTrack`** : `DARIJA | MSA | RELIGION`
- **Nouveau enum `DuelStatus`** : `WAITING | IN_PROGRESS | COMPLETED | CANCELLED`
- **`Module.track`** + **`Module.canonicalOrder`** (index composite `[track, canonicalOrder]`)
- **Cascades** ajoutées partout où la suppression d'un User/Module/Lesson doit nettoyer les FK (UserBadge, UserVocabulary, UserProgress, Duel, UserCulturalUnlock, etc.)
- **FriendRequest** : `@@unique([fromId, toId])` (plus de requêtes en double)
- **LeagueMembership** : `userId @unique` (1-1 strict user ↔ league)
- **Extensions `ExerciseType`** : `ARABIC_KEYBOARD`, `DRAWING`, `MATCHING`, `DUEL`

### Nouvelles tables
- [`Duel`](backend/prisma/schema.prisma#L315) — p1/p2/winner, status, scoreP1/P2, rounds, data JSON
- [`CulturalItem`](backend/prisma/schema.prisma#L410) — key unique, category, name/nameAr, region, rarity
- [`UserCulturalUnlock`](backend/prisma/schema.prisma#L430) — `@@unique([userId, itemId])`, source d'unlock

### Migration appliquée
Via `npx prisma db push --accept-data-loss` (tables cibles vides, aucun risque). Backfill de `track` + `canonicalOrder` avec [backend/scripts/backfillModuleTrack.ts](backend/scripts/backfillModuleTrack.ts).

---

## 2. Ordre pédagogique — Darija **=** MSA (alignement 1:1)

`canonicalOrder` est la même valeur entière entre les deux tracks pour les mêmes thèmes. Résultat audit en base :

| canonicalOrder | Thème        | Darija                     | MSA                        |
|----------------|--------------|----------------------------|----------------------------|
| 0              | Alphabet     | alphabet-darija            | msa-module-alphabet        |
| 1              | Salutations  | salutations-darija         | msa-module-salutations     |
| 2              | Présentation | se-presenter               | (à créer)                  |
| 3              | Famille      | la-famille                 | msa-module-famille         |
| 4              | Chiffres     | les-chiffres               | msa-module-chiffres        |
| 5              | Couleurs     | les-couleurs               | msa-module-couleurs        |
| 10             | Nourriture   | la-nourriture              | msa-module-nourriture      |
| 11             | Animaux      | module-animaux             | msa-module-animaux         |
| 12             | Corps/santé  | le-corps-la-sante          | msa-module-corps           |
| 21             | Transports   | les-transports             | msa-module-transports      |
| 23             | Métiers      | les-metiers-et-travail     | msa-module-metiers         |

Le tri côté API (`CoursesService.findAll`) utilise `canonicalOrder` en premier critère → Darija cours 1 = MSA cours 1.

**Doublons Darija dépubliés** : 11 modules (l'ancienne nomenclature `module-*` remplacée par les slugs plus récents `les-*`, `la-*`, etc.) via [backend/scripts/dedupModulesDarija.ts](backend/scripts/dedupModulesDarija.ts).

---

## 3. Track **Religion** — onglet séparé

- 3 modules migrés depuis MSA → RELIGION + renommés :
  - `msa-academy-islamic` → « Religion · Islam » (🟢 vert)
  - `msa-academy-quran` → « Religion · Coran » (🔵 bleu)
  - `msa-academy-others` → « Religion · Compléments » (🟣 violet)
- **Backend** : `GET /modules?track=RELIGION` filtre par enum [backend/src/modules/modules/modules.controller.ts](backend/src/modules/modules/modules.controller.ts)
- **Frontend** : 3 onglets dans [web/app/cours/page.tsx](web/app/cours/page.tsx) — 🇲🇦 Darija · 📖 MSA · 🕌 Religion. La sélection est persistée dans `localStorage` via [web/context/UserContext.tsx](web/context/UserContext.tsx).

---

## 4. Mécaniques nouvelles

### a) Clavier arabe
[web/components/exercises/ArabicKeyboardExercise.tsx](web/components/exercises/ArabicKeyboardExercise.tsx)
- **2 layouts au choix** (toggle) :
  - **Phonétique QWERTY** — chaque touche affiche la lettre arabe + son mapping latin (D, S, th, q…). Intuitif pour débutants.
  - **Standard** — layout Arabe ISO utilisé au Maroc (ض ص ث ق…)
- Strip permanent pour les **harakat** (fatha, damma, kasra, sukun, shadda, tanwin).
- Mode **Strict** (case optionnelle) : requiert les harakat exactes. Mode tolérant par défaut (normalise ا/أ/إ/آ, ي/ى, ه/ة, ignore tashkeel).
- Activé via `type: 'ARABIC_KEYBOARD'` ou `data.mechanic === 'arabic_keyboard'`.
- Persistance du choix de layout dans `localStorage['darija_ar_kbd_layout']`.

### b) Tracé de lettre (écriture/coloriage)
[web/components/exercises/TracingExercise.tsx](web/components/exercises/TracingExercise.tsx)
- Double canvas : **fantôme** (lettre cible semi-transparente) + **utilisateur** (trait au doigt/souris).
- Validation : ratio pixels ghost couverts par le trait (seuil configurable, défaut 0.45).
- Activé via `type: 'DRAWING'` ou `data.mechanic: 'tracing' | 'drawing'`.
- Base pour coloriage (change juste le fond et `target`).

### c) Duels PvP
[backend/src/modules/duels/](backend/src/modules/duels/)
- **REST complet** :
  - `POST /duels` — créer un duel ouvert (lessonId?, rounds?)
  - `GET /duels/open` — duels publics disponibles
  - `GET /duels/mine` — mes duels (actifs + récents)
  - `GET /duels/:id` — état du duel
  - `POST /duels/:id/join` — rejoindre
  - `POST /duels/:id/round` — soumettre un round `{score, correct}` — auto-finalise quand p1+p2 ont soumis tous les rounds
  - `POST /duels/:id/cancel` — annuler (créateur, WAITING uniquement)
- **Temps réel (phase 2 suggérée)** : le modèle `Duel.data` JSON est prêt pour un upgrade WebSocket (polling court possible en attendant). Installer `@nestjs/websockets` + `@nestjs/platform-socket.io` pour passer en push.

### d) Collection culturelle
[backend/src/modules/cultural/](backend/src/modules/cultural/)
- **27 items marocains seedés** via [backend/scripts/seedCulturalItems.ts](backend/scripts/seedCulturalItems.ts) :
  - **Food** (7) : tajine, couscous, pastilla, harira, thé à la menthe, msemen, bastilla au lait
  - **Music** (5) : gnawa, chaâbi, andalousi, raï, ahidous
  - **Place** (6) : Jemaâ el-Fna, Chefchaouen, Fès, Erg Chebbi, Essaouira, Oudayas
  - **Monument** (4) : Koutoubia, Tour Hassan, Mosquée Hassan II, Volubilis
  - **Tradition** (5) : henné, djellaba, hammam, mariage, Achoura
- **Rareté → prix en gemmes** : common 20 · rare 60 · epic 150 · legendary 400
- **Endpoints** :
  - `GET /cultural` (public, `?category=food`) — catalogue
  - `GET /cultural/mine` — ma collection
  - `POST /cultural/unlock/:key` — débloquer (coûte des gemmes)

---

## 5. Phase 2 — livrée aussi

| Tâche | État | Fichier |
|-------|------|---------|
| Lobby duels + polling | ✅ | [web/app/duels/page.tsx](web/app/duels/page.tsx) — 4s polling sur `/duels/open` + `/duels/mine`, créer/rejoindre/annuler |
| Vitrine culturelle dans `/shop` | ✅ | onglet « 🇲🇦 Collection » dans [web/app/shop/page.tsx](web/app/shop/page.tsx) — regroupé par catégorie, rareté colorée, prix en gemmes, achat via `/cultural/unlock/:key` |
| Exercices de démo des nouvelles mécaniques | ✅ | [backend/scripts/seedNewMechanics.ts](backend/scripts/seedNewMechanics.ts) — 3 clavier (سلام/شكرا/مرحبا) + 2 tracés (ب/م) dans une leçon spéciale « ⌨️ Clavier & tracé » du module Salutations Darija |
| Découvrabilité duels | ✅ | CTA « ⚔️ Duels 1v1 » en haut de [web/app/leaderboard/page.tsx](web/app/leaderboard/page.tsx) |

### Encore à faire (phase 3)
| Tâche | Priorité | Notes |
|-------|----------|-------|
| Écran de jeu duel (pendant le duel) | 🔥 | page `/duels/[id]/play` — afficher les rounds à soumettre, poll `/duels/:id`, POST `/duels/:id/round` — pour l'instant le lobby crée/rejoint, il faut jouer |
| Upgrade WebSocket pour duels | nice-to-have | `@nestjs/websockets` + Gateway — push temps réel au lieu du polling 4s |
| 172 audios MSA academy | bloqué | attendre Habibi-TTS dispo (cf. memory `project_academy_audios_pending.md`) |

---

## 6. Comment tester maintenant

```bash
# Backend (port 3001) — déjà lancé
curl http://localhost:3001/modules?track=RELIGION
curl http://localhost:3001/cultural

# Web (port 7000)
cd web && npm run dev
# → http://localhost:7000/cours et bascule entre Darija / MSA / Religion
```

Les 3 onglets, la bascule, et le tri aligné sont fonctionnels. Les nouvelles mécaniques (clavier, tracing) s'activent automatiquement dès qu'un exercice en base a `type: 'ARABIC_KEYBOARD'` ou `type: 'DRAWING'` — routées via [web/components/exercises/GenericExercisePlayer.tsx](web/components/exercises/GenericExercisePlayer.tsx).
