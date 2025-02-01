# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Define build arguments
ARG SUPABASE_URL
ARG SUPABASE_KEY

# Set environment variables
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_KEY=$SUPABASE_KEY

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Define build arguments again for the production stage
ARG SUPABASE_URL
ARG SUPABASE_KEY

# Set environment variables
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_KEY=$SUPABASE_KEY

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"] 