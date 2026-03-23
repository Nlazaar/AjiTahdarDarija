# Deploy Backend to Railway

Steps:

1. Push your repo to GitHub (or connect your Git provider to Railway).
2. Create a new Railway project and link your repository.
3. In Railway project settings, set the build command and start command (or use `railway.json` provided):
   - Build command: `npm install && npm run build`
   - Start command: `npm run start:prod`

Environment variables required:

- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — secret for signing JWT tokens
- `PORT` — port to run the server (Railway usually provides one; default `3000`)

Notes:
- We provide a `Dockerfile` and `.dockerignore` for building a production image if you prefer the Docker deployment option.
- Add Railway environment variables in the project settings before deploying.
