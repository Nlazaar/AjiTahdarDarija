FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "npm run build && node dist/main.js"]
