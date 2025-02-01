# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Define build arguments
ARG SUPABASE_URL
ARG SUPABASE_KEY

# Set environment variables
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_KEY=$SUPABASE_KEY

# Copy package files, but don't fail if package-lock.json doesn't exist
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Define build arguments again for the production stage
ARG SUPABASE_URL
ARG SUPABASE_KEY

# Set environment variables
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_KEY=$SUPABASE_KEY

# Copy package files
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"] 