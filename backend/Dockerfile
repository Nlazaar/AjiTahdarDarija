## Build stage
FROM node:18-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY package.json package-lock.json* ./
RUN npm ci --production=false
COPY . .
RUN npx prisma generate
RUN npm run build

## Production image
FROM node:18-slim AS runner
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]
