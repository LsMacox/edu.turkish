#!/bin/sh
set -euo pipefail

# Shadow DB name: from SHADOW_DB environment variable
: "${SHADOW_DB:?SHADOW_DB is required}"
: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is required}"

mysql --protocol=socket -uroot -p"$MYSQL_ROOT_PASSWORD" <<SQL
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Shadow database for Prisma migrations
CREATE DATABASE IF NOT EXISTS \`${SHADOW_DB}\`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

ALTER DATABASE \`${SHADOW_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Log
SELECT 'Shadow DB ensured' AS status, '${SHADOW_DB}' AS db_name;
SQL
