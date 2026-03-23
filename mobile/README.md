Darija Mobile (Expo + expo-router)

Screens (expo-router):
- / (Home)
- /login
- /progress
- /lesson/[id]
- /review
- /profile

Components:
- `components/Button.tsx`
- `components/Card.tsx`
- `components/LessonCard.tsx`
- `components/ModuleCard.tsx`

Quick start:

```bash
cd mobile
npm install
expo start
```

Notes:
- This scaffold uses `expo-router`. Dynamic route for lessons is `app/lesson/[id].tsx`.
- If you want TypeScript strictness or navigation customizations, I can add `tsconfig.json` and `expo-router` config.
