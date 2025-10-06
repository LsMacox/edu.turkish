# Multi-stage Dockerfile for Nuxt 4 (Nitro) + Prisma (MySQL) with Node.js

# =========================
# 0) Dependency install (cached)
# =========================
FROM node:22-slim AS deps
WORKDIR /app
ENV NODE_ENV=development

# Enable Corepack and PNPM
RUN corepack enable && corepack prepare pnpm@9 --activate

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy lockfiles separately to maximise cache reuse
COPY package.json pnpm-lock.yaml ./

# Install dependencies in layers for better caching
RUN pnpm fetch --prod=false


# =========================
# 1) Builder
# =========================
FROM deps AS builder
WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1 \
  NODE_ENV=development

# Accept build-time prerender toggle if provided
ARG NITRO_PRERENDER=false
ENV NITRO_PRERENDER=${NITRO_PRERENDER}

# Copy project sources
COPY . .

# Install deps from the prefetched store
RUN pnpm install --frozen-lockfile --offline

# Prisma client generation (no DB connection needed)
RUN pnpm exec prisma generate

# Build Nuxt into .output (Nitro node-server preset by default)
RUN pnpm run build

# Prune dev dependencies to prepare production node_modules
RUN pnpm install --prod --frozen-lockfile --offline


# =========================
# 2) Production runner
# =========================
FROM node:22-slim AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
ENV NODE_ENV=production \
  NUXT_TELEMETRY_DISABLED=1 \
  PATH=/app/node_modules/.bin:$PATH

RUN apt-get update \
  && apt-get install -y --no-install-recommends netcat-openbsd openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy runtime dependencies and build artefacts to a persistent location
RUN mkdir -p /opt/nuxt
COPY --from=builder /app/node_modules /opt/nuxt/node_modules
COPY --from=builder /app/.output /opt/nuxt/.output

# Expose them inside the working directory (keeps compatibility for plain images)
RUN ln -s /opt/nuxt/node_modules /app/node_modules \
  && ln -s /opt/nuxt/.output /app/.output

# Entrypoint handles migrations then boots the server
COPY contrib/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
