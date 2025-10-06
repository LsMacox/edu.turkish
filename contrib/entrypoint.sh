#!/usr/bin/env bash
set -euo pipefail


# If Nitro output is still missing, perform a build (last resort for fresh mounts)
if [[ ! -f /app/.output/server/index.mjs ]]; then
  echo "[entrypoint] .output not found. Running pnpm run build to regenerate it..."
  pnpm run build
fi

# Ensure Prisma Client is available (safe if already generated)
if [[ -f prisma/schema.prisma ]]; then
  pnpm exec prisma generate --schema=prisma/schema.prisma >/dev/null 2>&1 || true
fi

# Start Nitro server with Node.js runtime
exec node .output/server/index.mjs
