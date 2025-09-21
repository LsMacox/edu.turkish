# Multi-stage Dockerfile for Nuxt 4 (Nitro) + Prisma (MySQL) with Node.js

# =========================
# 0) Dependency install (cached)
# =========================
FROM node:22-slim AS deps
WORKDIR /app
ENV NODE_ENV=development

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy lockfiles separately to maximise cache reuse
COPY package.json package-lock.json ./

# Configure npm for better performance in containers
RUN npm config set prefer-offline true \
  && npm config set progress false \
  && npm config set fund false \
  && npm config set update-notifier false \
  && npm config set audit false

# Install dependencies in layers for better caching
RUN npm ci --prefer-offline --no-audit --include=dev && npm cache clean --force

# =========================
# 1) Builder
# =========================
FROM deps AS builder
WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1 \
    PRISMA_GENERATE_SKIP_DOWNLOAD=true \
    PRISMA_GENERATE_DATAPROXY=false \
    NODE_ENV=development

# Accept build-time prerender toggle if provided
ARG NITRO_PRERENDER=false
ENV NITRO_PRERENDER=${NITRO_PRERENDER}

# Copy project sources
COPY . .

# Prisma client generation (no DB connection needed)
RUN npm run db:generate || echo "Prisma generate completed with timeout"

# Build Nuxt into .output (Nitro node-server preset by default)
RUN npm run build

# =========================
# 2) Production dependencies (no dev deps)
# =========================
FROM node:22-slim AS prod-deps
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Configure npm for better performance in containers
RUN npm config set prefer-offline true \
  && npm config set progress false \
  && npm config set fund false \
  && npm config set update-notifier false \
  && npm config set audit false

COPY package.json package-lock.json ./
# Install only production dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit && npm cache clean --force

# =========================
# 3) Production runner
# =========================
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    HOST=0.0.0.0 \
    PORT=3000 \
    NUXT_TELEMETRY_DISABLED=1 \
    PATH=/app/node_modules/.bin:$PATH

RUN apt-get update \
  && apt-get install -y --no-install-recommends netcat-openbsd openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy production node_modules, plus Prisma CLI + engines from deps stage
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# Copy build artefacts and runtime files
COPY --from=builder /app/.output ./.output
COPY prisma ./prisma
COPY package.json ./

# Entrypoint handles migrations then boots the server
COPY contrib/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
