# Darija Maroc — Monorepo

Structure initiale:

- /backend  — NestJS + Prisma + PostgreSQL
- /web      — Next.js 14 + App Router + Tailwind
- /mobile   — Expo + React Native + expo-router

Quick start (local):

Backend

1. cd backend
2. cp .env.example .env && edit DATABASE_URL
3. npm install
4. npx prisma generate
5. npm run start:dev

Web

1. cd web
2. npm install
3. npm run dev

Mobile

1. cd mobile
2. npm install
3. expo start

Notes:
- `prisma/schema.prisma` contient des modèles `User` et `Lesson` de base.
- Pour `shadcn/ui`, suivre l'outil officiel (npx shadcn-ui) pour initialiser les composants UI.
- Cette scaffolding vise une architecture modulaire: backend modules (`users`, `lessons`), web `app` router, mobile `App.tsx` + `expo-router`.
