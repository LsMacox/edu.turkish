-- Add typed columns for mandatory application attributes
ALTER TABLE `applications`
  ADD COLUMN `first_name` VARCHAR(100) NOT NULL DEFAULT '' AFTER `status`,
  ADD COLUMN `last_name` VARCHAR(100) NULL AFTER `first_name`,
  ADD COLUMN `email` VARCHAR(255) NULL AFTER `last_name`,
  ADD COLUMN `phone` VARCHAR(30) NOT NULL DEFAULT '' AFTER `email`,
  ADD COLUMN `country` VARCHAR(100) NULL AFTER `phone`,
  ADD COLUMN `city` VARCHAR(100) NULL AFTER `country`,
  ADD COLUMN `education_level` VARCHAR(100) NULL AFTER `city`,
  ADD COLUMN `education_field` VARCHAR(255) NULL AFTER `education_level`,
  ADD COLUMN `target_university` VARCHAR(255) NULL AFTER `education_field`,
  ADD COLUMN `target_program` VARCHAR(255) NULL AFTER `target_university`,
  ADD COLUMN `source` VARCHAR(100) NOT NULL DEFAULT 'unknown' AFTER `target_program`,
  ADD COLUMN `referral_code` VARCHAR(100) NULL AFTER `source`;

-- Backfill typed columns from existing JSON blobs
UPDATE `applications`
SET
  `first_name` = COALESCE(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`personal_info`, '$.first_name'))), ''), `first_name`),
  `last_name` = NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`personal_info`, '$.last_name'))), ''),
  `email` = NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`personal_info`, '$.email'))), ''),
  `phone` = COALESCE(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`personal_info`, '$.phone'))), ''), `phone`),
  `country` = NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`personal_info`, '$.country'))), ''),
  `city` = NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`personal_info`, '$.city'))), ''),
  `education_level` = NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`education`, '$.level'))), ''),
  `education_field` = NULLIF(TRIM(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(`education`, '$.field')), 'Не указано')), ''),
  `target_university` = NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`preferences`, '$.universities[0]'))), ''),
  `target_program` = NULLIF(TRIM(
    COALESCE(
      NULLIF(JSON_UNQUOTE(JSON_EXTRACT(`preferences`, '$.programs[0]')), ''),
      NULLIF(JSON_UNQUOTE(JSON_EXTRACT(`education`, '$.field')), 'Не указано')
    )
  ), ''),
  `referral_code` = NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(`preferences`, '$.referral_code'))), '');

-- Ensure source is at least set to a fallback value
UPDATE `applications`
SET `source` = 'unknown'
WHERE `source` = '' OR `source` IS NULL;
