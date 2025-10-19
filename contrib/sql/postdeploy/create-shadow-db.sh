#!/bin/sh
set -euo pipefail

# Shadow DB name: from SHADOW_DB or derived from SHADOW_DATABASE_URL
SHADOW_DB="${SHADOW_DB:-}"

# Resolve MySQL connection details from env with fallbacks
MYSQL_HOST="${DB_HOST:-${MYSQL_HOST:-127.0.0.1}}"
MYSQL_PORT="${DB_PORT:-${MYSQL_PORT:-3306}}"
MYSQL_ROOT_PASSWORD="${DB_ROOT_PASS:-${MYSQL_ROOT_PASSWORD:-}}"

if [ -z "${MYSQL_ROOT_PASSWORD}" ]; then
  echo "ERROR: Provide root password via DB_ROOT_PASS or MYSQL_ROOT_PASSWORD" >&2
  exit 1
fi

mysql -h"${MYSQL_HOST}" -P"${MYSQL_PORT}" -uroot -p"${MYSQL_ROOT_PASSWORD}" <<SQL
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS \`${SHADOW_DB}\`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

ALTER DATABASE \`${SHADOW_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SQL

echo "Shadow DB ensured: ${SHADOW_DB}"
