-- Initial database setup for Docker
-- This file is automatically executed when the MySQL container starts

-- Set charset and collation for proper multilingual support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS `edu_turkish` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'edu_turkish_user'@'%' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON `edu_turkish`.* TO 'edu_turkish_user'@'%';
FLUSH PRIVILEGES;

SET time_zone = '+00:00';

SET FOREIGN_KEY_CHECKS = 1;

-- Show confirmation
SELECT 'Database initialization completed!' as message;