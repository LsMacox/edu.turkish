-- Initial database setup for Docker
-- This file is automatically executed when the MySQL container starts

-- Set charset and collation for proper multilingual support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create the databases if they don't exist
CREATE DATABASE IF NOT EXISTS `edu_turkish` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `edu_turkish_app` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the default Directus database
USE `edu_turkish`;

-- Set timezone
SET time_zone = '+00:00';

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Ensure app user has privileges on both DBs (for local dev)
-- NOTE: username/password must match docker-compose defaults
GRANT ALL PRIVILEGES ON `edu_turkish`.* TO 'edu_turkish_user'@'%';
GRANT ALL PRIVILEGES ON `edu_turkish_app`.* TO 'edu_turkish_user'@'%';
FLUSH PRIVILEGES;

-- Let Docker entrypoint create users from env; grants not needed here

-- Show confirmation
SELECT 'Database initialization completed!' as message;