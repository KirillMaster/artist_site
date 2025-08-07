# Этап сборки
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап запуска (для разработки)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV development # Changed to development
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
# Copy source directories needed for development
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/components ./components
COPY --from=builder /app/styles ./styles

EXPOSE 3000
# CMD ["npm", "start"] is overridden by docker-compose.yml's command: npm run dev