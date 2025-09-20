#!/usr/bin/env bash
set -euo pipefail

# Note: DB connection is handled by Docker Compose depends_on with healthcheck
# No need to manually wait for DB - it will be ready when container starts

# Prepare DATABASE_URL from discrete DB_* vars if not set
if [[ -z "${DATABASE_URL:-}" ]] && [[ -n "${DB_HOST:-}" ]]; then
  : "${DB_USER:=edu_turkish_user}"
  : "${DB_PASSWORD:=secure_password_123}"
  : "${DB_NAME:=edu_turkish_app}"
  : "${DB_PORT:=3306}"
  export DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# Apply migrations. If P3005 occurs, exit with clear message (no auto-baseline in prod)
if [[ -f prisma/schema.prisma ]] && [[ -n "${DATABASE_URL:-}" ]]; then
  echo "Running prisma migrate deploy..."
  set +e
  DEPLOY_OUTPUT=$(timeout 120 npx prisma migrate deploy 2>&1)
  DEPLOY_EXIT=$?
  set -e

  if [[ $DEPLOY_EXIT -ne 0 ]]; then
    echo "$DEPLOY_OUTPUT" | sed -e 's/^/prisma: /'
    if echo "$DEPLOY_OUTPUT" | grep -q "P3005"; then
      echo "\nPrisma error P3005: Database is not empty and has no migration history.\n"
      echo "Please baseline manually before first deploy, e.g.:"
      echo "  npx prisma migrate resolve --applied <migration_folder_name>  # for each existing migration"
      echo "Then rerun the container."
      exit 1
    fi
  fi
fi

# Start Nitro server with Node.js runtime
exec node .output/server/index.mjs
