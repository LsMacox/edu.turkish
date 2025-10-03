#!/bin/sh
set -euo pipefail

: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is required}"
: "${APP_DB:?APP_DB is required}"
: "${APP_USER:?APP_USER is required}"
: "${APP_PASS:?APP_PASS is required}"

mysql --protocol=socket -uroot -p"$MYSQL_ROOT_PASSWORD" <<SQL
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Базы
CREATE DATABASE IF NOT EXISTS \`${APP_DB}\`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Пользователь приложения: полный доступ к APP_DB
CREATE USER IF NOT EXISTS '${APP_USER}'@'%' IDENTIFIED BY '${APP_PASS}';
GRANT ALL PRIVILEGES ON \`${APP_DB}\`.* TO '${APP_USER}'@'%';
FLUSH PRIVILEGES;

-- Привести кодировку/колляцию APP_DB (без PREPARE)
ALTER DATABASE \`${APP_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Сообщение для логов
SELECT 'Database initialization completed!' AS message;
SQL
