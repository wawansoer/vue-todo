FROM oven/bun:canary-alpine AS base

WORKDIR /app

# Copy only package.json and lockfile
COPY package*.json ./

# Install dependencies (cacheable layer)
RUN bun install

# --- Builder Stage ---
FROM base AS builder

# Copy source code
COPY . .

# Build the application
RUN bun run build

# --- Deploy Stage ---
FROM oven/bun:canary-alpine AS deploy

WORKDIR /app

# Install http-server globally, only needed at runtime
RUN bun install -g http-server

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["http-server", "dist"]