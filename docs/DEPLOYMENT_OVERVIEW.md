# Deployment Overview

This document explains how to deploy each part of the project and configure CI secrets.

## 1. Backend (Railway)
- Deploy options:
  - Direct Git integration: connect repository in Railway dashboard and set the `backend` folder as service root.
  - Docker: Railway supports Docker; a `Dockerfile` is provided in `backend/Dockerfile`.
- Required environment variables (set in Railway project settings):
  - `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- CI: a GitHub Actions workflow exists at `.github/workflows/backend-deploy.yml` which builds/pushes a container and will trigger Railway deploy if `RAILWAY_API_KEY` secret is set.

## 2. Web (Vercel)
- Connect the `web` folder to Vercel (monorepo support) and set project to use Next.js.
- Required environment variables:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_ENV=production`
- A `vercel.json` is included. The workflow `.github/workflows/web-deploy-vercel.yml` uses `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets to automatically deploy on push to `main`.

## 3. Mobile (Expo / EAS)
- Configure `app.json` with `slug` and `android.package` (done). Add icons at `mobile/assets/icon.png` and `mobile/assets/splash.png`.
- Use EAS for production builds. `eas.json` includes a `production` profile for Android app bundles.
- CI: `.github/workflows/mobile-eas-build.yml` will run EAS builds when triggered or on pushes to `main`.
- Required secrets:
  - `EAS_BUILD_TOKEN` or `EXPO_TOKEN` in GitHub secrets for non-interactive builds and submission.

## 4. GitHub Secrets to configure
- `RAILWAY_API_KEY` — Railway API key (if using Railway CLI in workflows)
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — for Vercel action
- `EAS_BUILD_TOKEN` / `EXPO_TOKEN` — for Expo EAS builds
- (Optional) Docker registry secrets if you push images (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)

## 5. Testing production locally
- Backend: build and run Docker image or run `npm ci && npm run build && npm run start:prod` inside `backend`
- Web: set `NEXT_PUBLIC_API_URL` to your backend URL and run `npm run build` and `npm start` in `web`.
- Mobile: use `eas build -p android --profile production` and test the generated bundle.

## 6. Notes
- Adjust any routes/ports depending on hosting providers.
- Ensure database and other external resources (Redis, object storage) are configured and secrets are set in each hosting platform.
