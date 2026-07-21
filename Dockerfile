# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333

COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/endpoints ./endpoints
COPY --from=builder /app/helpers ./helpers
COPY --from=builder /app/loadEnv.js ./loadEnv.js
COPY --from=builder /app/process.env.d.ts ./process.env.d.ts

EXPOSE 3333

CMD ["npx", "tsx", "server.ts"]
