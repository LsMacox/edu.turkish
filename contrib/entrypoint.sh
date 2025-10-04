#!/usr/bin/env bash
set -euo pipefail

# Helper to ensure we have access to build artefacts even if /app is bind-mounted
restore_link() {
  local source="$1"
  local dest="$2"
  local sentinel="$3"

  if [[ -n "$sentinel" && -e "${dest}/${sentinel}" ]]; then
    return 0
  fi

  if [[ ! -e "$source" ]]; then
    return 1
  fi

  if [[ -e "$dest" || -L "$dest" ]]; then
    rm -rf "$dest"
  fi

  ln -s "$source" "$dest"
}

# Restore node_modules and Nitro output if they vanished because of a bind mount
restore_link /opt/nuxt/node_modules /app/node_modules ".bin/nuxt" || true
restore_link /opt/nuxt/.output /app/.output "server/index.mjs" || true

# If Nitro output is still missing, perform a build (last resort for fresh mounts)
if [[ ! -f /app/.output/server/index.mjs ]]; then
  echo "[entrypoint] .output not found. Running npm run build to regenerate it..."
  npm run build
fi

# Ensure Prisma Client is available (safe if already generated)
if [[ -f prisma/schema.prisma ]]; then
  npx prisma generate --schema=prisma/schema.prisma >/dev/null 2>&1 || true
fi

# Start Nitro server with Node.js runtime
exec node .output/server/index.mjs
