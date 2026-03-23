Next.js 14 app structure

Pages (App Router):
- / (Home)
- /login, /register (Auth)
- /progress (Arbre de progression)
- /lesson/[id] (Leçon)
- /review (Révision)
- /profile (Profil)
- /settings (Paramètres)

Components:
- `components/Button.tsx`
- `components/Card.tsx`
- `components/ProgressBar.tsx`
- `components/LessonCard.tsx`
- `components/ModuleCard.tsx`

Setup notes:
1. Installer dépendances:

```bash
cd web
npm install
```

2. Initialiser `shadcn/ui` si vous voulez utiliser ses composants:

```bash
npx shadcn-ui@latest init
```

3. Démarrer le dev server:

```bash
npm run dev
```

Tailwind est déjà configuré via `tailwind.config.cjs` et `globals.css`.
