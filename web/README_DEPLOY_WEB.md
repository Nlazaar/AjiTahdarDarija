# Deploy Web (Vercel)

1. Connect repository to Vercel:
   - Go to https://vercel.com and import your GitHub repository.
   - Select the project and the root `web` directory if using a monorepo.

2. Environment variables:
   - `NEXT_PUBLIC_API_URL` — URL of your backend (production)
   - `NEXT_PUBLIC_ENV=production`

3. Build & Output:
   - Vercel will run `npm run build` (configured in `package.json`).
   - We use Next.js standalone output; `vercel.json` is included for configuration.

4. Optional Docker deployment:
   - A `Dockerfile` is included if you prefer to build/run outside Vercel.
