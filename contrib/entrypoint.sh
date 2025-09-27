#!/usr/bin/env bash
set -euo pipefail

# Note: DB connection is handled by Docker Compose depends_on with healthcheck
# No need to manually wait for DB - it will be ready when container starts

# Prepare DATABASE_URL from discrete DB_* vars if not set
if [[ -z "${DATABASE_URL:-}" ]] && [[ -n "${DB_HOST:-}" ]]; then
  : "${DB_USER:=edu_turkish_user}"
  : "${DB_PASSWORD:=secure_password_123}"
  : "${DB_NAME:=edu_turkish}"
  : "${DB_PORT:=3306}"
  export DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# Ensure Prisma Client is available (safe if already generated)
if [[ -f prisma/schema.prisma ]]; then
  npx prisma generate --schema=prisma/schema.prisma >/dev/null 2>&1 || true
fi

# Start Nitro server with Node.js runtime
exec node .output/server/index.mjs
