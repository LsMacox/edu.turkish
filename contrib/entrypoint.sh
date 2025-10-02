#!/usr/bin/env bash
set -euo pipefail

# Ensure Prisma Client is available (safe if already generated)
if [[ -f prisma/schema.prisma ]]; then
  npx prisma generate --schema=prisma/schema.prisma >/dev/null 2>&1 || true
fi

# Start Nitro server with Node.js runtime
exec node .output/server/index.mjs
