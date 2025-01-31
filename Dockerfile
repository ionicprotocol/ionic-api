# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy both package.json and package-lock.json
COPY package*.json package-lock.json ./
RUN npm ci

COPY .env.example ./.env
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy both package.json and package-lock.json
COPY package*.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

EXPOSE 3000
CMD ["node", "dist/main"] 