-- Normalize featured programs: add dedicated tables and drop legacy JSON column

-- Create main featured programs table
CREATE TABLE `featured_programs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `university_id` INT NOT NULL,
  `program_id` INT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uniq_featured_program_per_university`(`university_id`, `program_id`),
  INDEX `idx_featured_program_university`(`university_id`),
  INDEX `idx_featured_program_program`(`program_id`),
  INDEX `idx_featured_program_order`(`display_order`),
  CONSTRAINT `featured_programs_university_id_fkey`
    FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `featured_programs_program_id_fkey`
    FOREIGN KEY (`program_id`) REFERENCES `academic_programs`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create translations table for featured program labels
CREATE TABLE `featured_program_translations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `featured_program_id` INT NOT NULL,
  `locale` VARCHAR(5) NOT NULL,
  `label` VARCHAR(255) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uniq_featured_program_translation`(`featured_program_id`, `locale`),
  CONSTRAINT `featured_program_translations_featured_program_id_fkey`
    FOREIGN KEY (`featured_program_id`) REFERENCES `featured_programs`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Remove legacy JSON field from university translations
ALTER TABLE `university_translations`
  DROP COLUMN `strong_programs`;
