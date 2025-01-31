# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files, but don't fail if package-lock.json doesn't exist
COPY package*.json ./
RUN npm install

COPY .env.example ./.env
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

EXPOSE 3000
CMD ["node", "dist/main"] 