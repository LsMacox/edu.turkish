-- Remove redundant education targeting columns from applications
ALTER TABLE `applications`
  DROP COLUMN `education_level`,
  DROP COLUMN `education_field`,
  DROP COLUMN `target_university`,
  DROP COLUMN `target_program`;
