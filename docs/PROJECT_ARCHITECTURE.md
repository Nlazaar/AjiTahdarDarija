# DarijaMaroc — Project Architecture

Summary of repository structure, core libraries, and main screen flow.

## Overview
- Frontend (Web): Next.js (App Router) app located in `web/`.
  - Server + Client components pattern.
  - UI components in `web/components/` and small hooks in `web/hooks/`.
  - API client in `web/lib/api.ts`.
- Backend: NestJS service in `backend/` with Prisma and seed scripts in `backend/scripts/`.
- Mobile: Expo + expo-router app in `mobile/`.

## Core Libraries
- Web: `next`, `react`, `lucide-react`, `clsx`. Dev: `tailwindcss` (v4), `typescript`, `postcss`.
- Backend: `@nestjs/*`, `@prisma/client`, `ioredis`, `stripe`, `helmet`, `cors`, `date-fns`.
- Mobile: `expo`, `expo-router`, `expo-secure-store`, `@react-native-async-storage/async-storage`.

## Key Routes (Web)
- `/` — Home / landing
- `/welcome` & `/welcome/level` — Onboarding & level selection
- `/progress` — Module / lesson progress tree (client-hydrated nodes)
- `/lecons/alphabet` — Alphabet lesson entry
- `/lesson/[id]` — Lesson player (exercises & flashcards)
- `/lesson/[id]/progress` — Lesson progress
- `/conversation` — Chatbot (client)
- `/friends` — Friends / requests (client)
- `/leaderboard` — Gamification scoreboard

## Data flow
- `web` calls backend API at `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).
- Backend seeds modules/lessons via `backend/scripts/seedModules.js`.

## Notes / Next steps
- Client-only pages (chat, friends, lesson player controls) must include `"use client"` at top.
- Progress nodes are built as server-rendered shell + client hydration to show dynamic state.

