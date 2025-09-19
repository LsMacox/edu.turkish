-- Initial database setup for Docker
-- This file is automatically executed when the MySQL container starts

-- Set charset and collation for proper multilingual support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `edu_turkish` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `edu_turkish`;

-- Set timezone
SET time_zone = '+00:00';

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Let Docker entrypoint create users from env; grants not needed here

-- Show confirmation
SELECT 'Database initialization completed!' as message;