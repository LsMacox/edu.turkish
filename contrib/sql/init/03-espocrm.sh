#!/bin/sh
set -euo pipefail

: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is required}"
ESPOCRM_DB_NAME="${ESPOCRM_DB_NAME:-espocrm_db}"
ESPOCRM_DB_USER="${ESPOCRM_DB_USER:-espocrm_user}"
: "${ESPOCRM_DB_PASSWORD:?ESPOCRM_DB_PASSWORD is required}"

# Экранируем одинарные кавычки в пароле для безопасной подстановки в SQL
ESCAPED_PW=$(printf "%s" "$ESPOCRM_DB_PASSWORD" | sed "s/'/''/g")

# Удалим более специфичные аккаунты (host <> '%'), чтобы не перекрывали '%'
HOSTS=$(mysql --protocol=socket -N -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SELECT host FROM mysql.user WHERE user='${ESPOCRM_DB_USER}' AND host <> '%';" 2>/dev/null || true)
if [ -n "$HOSTS" ]; then
  for h in $HOSTS; do
    mysql --protocol=socket -uroot -p"$MYSQL_ROOT_PASSWORD" -e "DROP USER IF EXISTS '${ESPOCRM_DB_USER}'@'${h}';" || true
  done
fi

mysql --protocol=socket -uroot -p"$MYSQL_ROOT_PASSWORD" <<SQL
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Ensure database exists
CREATE DATABASE IF NOT EXISTS \`${ESPOCRM_DB_NAME}\`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Ensure user exists and has correct password

CREATE USER IF NOT EXISTS '${ESPOCRM_DB_USER}'@'%' IDENTIFIED WITH mysql_native_password BY '${ESCAPED_PW}';
ALTER USER '${ESPOCRM_DB_USER}'@'%' IDENTIFIED WITH mysql_native_password BY '${ESCAPED_PW}';

-- Grant privileges
GRANT ALL PRIVILEGES ON \`${ESPOCRM_DB_NAME}\`.* TO '${ESPOCRM_DB_USER}'@'%';
FLUSH PRIVILEGES;

-- Log
SELECT 'EspoCRM DB ensured' AS status, '${ESPOCRM_DB_NAME}' AS db, '${ESPOCRM_DB_USER}' AS user;
SQL
