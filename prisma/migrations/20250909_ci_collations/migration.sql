-- Ensure database and tables use utf8mb4 and case-insensitive collation
-- Adjust collations for key text columns to enable case-insensitive comparisons

SET @schema := DATABASE();

-- Universities table updates
SET @table_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'universities'
);

SET @sql := IF(
  @table_exists = 1,
  'ALTER TABLE `universities` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'universities' AND COLUMN_NAME = 'hero_image'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `universities` MODIFY `hero_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'universities' AND COLUMN_NAME = 'image'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `universities` MODIFY `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- University translations updates
SET @table_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'university_translations'
);

SET @sql := IF(
  @table_exists = 1,
  'ALTER TABLE `university_translations` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'university_translations' AND COLUMN_NAME = 'locale'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `university_translations` MODIFY `locale` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'university_translations' AND COLUMN_NAME = 'title'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `university_translations` MODIFY `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'university_translations' AND COLUMN_NAME = 'slug'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `university_translations` MODIFY `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Program translations updates
SET @table_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'program_translations'
);

SET @sql := IF(
  @table_exists = 1,
  'ALTER TABLE `program_translations` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'program_translations' AND COLUMN_NAME = 'locale'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `program_translations` MODIFY `locale` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'program_translations' AND COLUMN_NAME = 'name'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `program_translations` MODIFY `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Review translations updates
SET @table_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'review_translations'
);

SET @sql := IF(
  @table_exists = 1,
  'ALTER TABLE `review_translations` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'review_translations' AND COLUMN_NAME = 'locale'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `review_translations` MODIFY `locale` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'review_translations' AND COLUMN_NAME = 'name'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `review_translations` MODIFY `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = 'review_translations' AND COLUMN_NAME = 'university_name'
);
SET @sql := IF(
  @column_exists = 1,
  'ALTER TABLE `review_translations` MODIFY `university_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
