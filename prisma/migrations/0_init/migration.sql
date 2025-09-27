-- CreateTable
CREATE TABLE `universities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `countryId` INTEGER NULL,
    `cityId` INTEGER NULL,
    `founded_year` INTEGER NULL,
    `type` ENUM('state', 'private', 'tech', 'elite') NOT NULL DEFAULT 'state',
    `tuition_min` DECIMAL(10, 2) NULL,
    `tuition_max` DECIMAL(10, 2) NULL,
    `currency` VARCHAR(3) NULL DEFAULT 'USD',
    `total_students` INTEGER NULL,
    `international_students` INTEGER NULL,
    `rankingScore` INTEGER NULL,
    `has_accommodation` BOOLEAN NOT NULL DEFAULT false,
    `has_scholarships` BOOLEAN NOT NULL DEFAULT false,
    `hero_image` VARCHAR(500) NULL,
    `image` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_university_type`(`type`),
    INDEX `idx_university_country`(`countryId`),
    INDEX `idx_university_city`(`cityId`),
    INDEX `idx_university_accommodation`(`has_accommodation`),
    INDEX `idx_university_scholarships`(`has_scholarships`),
    INDEX `idx_university_founded_year`(`founded_year`),
    INDEX `idx_university_tuition`(`tuition_min`, `tuition_max`, `currency`),
    INDEX `idx_university_total_students`(`total_students`),
    INDEX `idx_university_international_students`(`international_students`),
    INDEX `idx_university_ranking_score`(`rankingScore`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `about` JSON NULL,
    `key_info_texts` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_translations_university_id_locale_key`(`university_id`, `locale`),
    UNIQUE INDEX `university_translations_locale_slug_key`(`locale`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `countries_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_country_locale_name`(`locale`, `name`),
    UNIQUE INDEX `country_translations_country_id_locale_key`(`country_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_city_country`(`country_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_city_locale_name`(`locale`, `name`),
    UNIQUE INDEX `city_translations_city_id_locale_key`(`city_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_media_assets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `kind` ENUM('image', 'video') NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `thumbnail_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_media_university`(`university_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_media_asset_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_media_asset_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NULL,
    `alt` VARCHAR(255) NULL,
    `caption` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_media_asset_translations_university_media_asset_i_key`(`university_media_asset_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_programs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `degree_type` ENUM('bachelor', 'master', 'phd') NOT NULL,
    `languageCode` VARCHAR(5) NOT NULL,
    `duration_years` INTEGER NOT NULL,
    `tuition_per_year` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_program_university_degree`(`university_id`, `degree_type`),
    INDEX `idx_program_language`(`languageCode`),
    INDEX `idx_program_tuition`(`tuition_per_year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_program_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_program_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_program_translations_university_program_id_locale_key`(`university_program_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NULL,
    `type` ENUM('student', 'parent') NOT NULL,
    `year` INTEGER NULL,
    `rating` TINYINT NULL,
    `avatar` VARCHAR(500) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_review_university_type`(`university_id`, `type`),
    INDEX `idx_review_featured`(`featured`),
    INDEX `idx_review_rating`(`rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_review_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_review_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NULL,
    `quote` TEXT NULL,
    `university_name` VARCHAR(255) NULL,
    `achievements` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_review_translations_university_review_id_locale_key`(`university_review_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faqs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faq_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `faq_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `question` VARCHAR(500) NULL,
    `answer` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `faq_translations_faq_id_locale_key`(`faq_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faq_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faq_category_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_faq_category_locale_name`(`locale`, `name`),
    UNIQUE INDEX `faq_category_translations_category_id_locale_key`(`category_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tracking_code` VARCHAR(50) NOT NULL,
    `status` ENUM('submitted', 'processing', 'approved', 'rejected') NOT NULL DEFAULT 'submitted',
    `first_name` VARCHAR(100) NOT NULL DEFAULT '',
    `last_name` VARCHAR(100) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(30) NOT NULL DEFAULT '',
    `country` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `education_level` VARCHAR(100) NULL,
    `education_field` VARCHAR(255) NULL,
    `target_university` VARCHAR(255) NULL,
    `target_program` VARCHAR(255) NULL,
    `source` VARCHAR(100) NOT NULL DEFAULT 'unknown',
    `referral_code` VARCHAR(100) NULL,
    `personal_info` JSON NOT NULL,
    `education` JSON NOT NULL,
    `preferences` JSON NOT NULL,
    `additional_info` JSON NULL,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `applications_tracking_code_key`(`tracking_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_campus_facilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `image` VARCHAR(500) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `icon` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_facility_filters`(`university_id`, `is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_campus_facility_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_campus_facility_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_campus_facility_translations_university_campus_fa_key`(`university_campus_facility_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_admission_requirements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_requirement_university`(`university_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_admission_requirement_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_admission_requirement_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `category` VARCHAR(100) NULL,
    `requirement` VARCHAR(255) NULL,
    `details` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_admission_requirement_translations_university_adm_key`(`university_admission_requirement_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_required_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_document_university`(`university_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_required_document_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_required_document_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `format_requirements` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_required_document_translations_university_require_key`(`university_required_document_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_important_dates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `type` ENUM('deadline', 'event', 'exam', 'notification') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_date_filters`(`university_id`, `type`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_important_date_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_important_date_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `event` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_important_date_translations_university_important__key`(`university_important_date_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_scholarships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `type` ENUM('government', 'university', 'private') NOT NULL,
    `coverage_percentage` INTEGER NOT NULL,
    `application_deadline` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_scholarship_type`(`university_id`, `type`),
    INDEX `idx_scholarship_coverage`(`coverage_percentage`),
    INDEX `idx_scholarship_deadline`(`application_deadline`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_scholarship_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_scholarship_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NULL,
    `eligibility_criteria` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_scholarship_translations_university_scholarship_i_key`(`university_scholarship_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `study_directions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_pivot_study_directions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `study_direction_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_pivot_study_directions_university_id_study_direct_key`(`university_id`, `study_direction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `study_direction_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `study_direction_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `study_direction_translations_study_direction_id_locale_key`(`study_direction_id`, `locale`),
    UNIQUE INDEX `study_direction_translations_locale_slug_key`(`locale`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(64) NOT NULL,
    `order` SMALLINT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_categories_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_category_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `blog_category_translations_category_id_locale_key`(`category_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_articles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(3) NOT NULL,
    `cover_image` VARCHAR(500) NULL,
    `hero_image` VARCHAR(500) NULL,
    `reading_time_minutes` INTEGER NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_blog_article_category`(`category_id`),
    INDEX `idx_blog_article_published_at`(`published_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_article_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `excerpt` VARCHAR(500) NULL,
    `reading_time` VARCHAR(50) NULL,
    `hero_kicker` VARCHAR(120) NULL,
    `hero_subtitle` VARCHAR(500) NULL,
    `hero_location` VARCHAR(120) NULL,
    `image_alt` VARCHAR(255) NULL,
    `hero_image_alt` VARCHAR(255) NULL,
    `seo_description` VARCHAR(500) NULL,
    `content` JSON NULL,
    `quick_facts` JSON NULL,
    `highlights` JSON NULL,
    `tags` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_article_translations_article_id_locale_key`(`article_id`, `locale`),
    UNIQUE INDEX `blog_article_translations_locale_slug_key`(`locale`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_pivot_featured_programs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `university_program_id` INTEGER NOT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_featured_program_university`(`university_id`),
    INDEX `idx_featured_program_program`(`university_program_id`),
    INDEX `idx_featured_program_order`(`display_order`),
    UNIQUE INDEX `uniq_featured_program_per_university`(`university_id`, `university_program_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_pivot_featured_program_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_pivot_featured_program_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `label` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `uniq_featured_program_translation`(`university_pivot_featured_program_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `universities` ADD CONSTRAINT `universities_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `universities` ADD CONSTRAINT `universities_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_translations` ADD CONSTRAINT `university_translations_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `country_translations` ADD CONSTRAINT `country_translations_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cities` ADD CONSTRAINT `cities_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city_translations` ADD CONSTRAINT `city_translations_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_media_assets` ADD CONSTRAINT `university_media_assets_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_media_asset_translations` ADD CONSTRAINT `university_media_asset_translations_university_media_asset__fkey` FOREIGN KEY (`university_media_asset_id`) REFERENCES `university_media_assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_programs` ADD CONSTRAINT `university_programs_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_program_translations` ADD CONSTRAINT `university_program_translations_university_program_id_fkey` FOREIGN KEY (`university_program_id`) REFERENCES `university_programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_reviews` ADD CONSTRAINT `university_reviews_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_review_translations` ADD CONSTRAINT `university_review_translations_university_review_id_fkey` FOREIGN KEY (`university_review_id`) REFERENCES `university_reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faqs` ADD CONSTRAINT `faqs_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `faq_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faq_translations` ADD CONSTRAINT `faq_translations_faq_id_fkey` FOREIGN KEY (`faq_id`) REFERENCES `faqs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faq_category_translations` ADD CONSTRAINT `faq_category_translations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `faq_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_campus_facilities` ADD CONSTRAINT `university_campus_facilities_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_campus_facility_translations` ADD CONSTRAINT `university_campus_facility_translations_university_campus_f_fkey` FOREIGN KEY (`university_campus_facility_id`) REFERENCES `university_campus_facilities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_admission_requirements` ADD CONSTRAINT `university_admission_requirements_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_admission_requirement_translations` ADD CONSTRAINT `university_admission_requirement_translations_university_ad_fkey` FOREIGN KEY (`university_admission_requirement_id`) REFERENCES `university_admission_requirements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_required_documents` ADD CONSTRAINT `university_required_documents_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_required_document_translations` ADD CONSTRAINT `university_required_document_translations_university_requir_fkey` FOREIGN KEY (`university_required_document_id`) REFERENCES `university_required_documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_important_dates` ADD CONSTRAINT `university_important_dates_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_important_date_translations` ADD CONSTRAINT `university_important_date_translations_university_important_fkey` FOREIGN KEY (`university_important_date_id`) REFERENCES `university_important_dates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_scholarships` ADD CONSTRAINT `university_scholarships_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_scholarship_translations` ADD CONSTRAINT `university_scholarship_translations_university_scholarship__fkey` FOREIGN KEY (`university_scholarship_id`) REFERENCES `university_scholarships`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_pivot_study_directions` ADD CONSTRAINT `university_pivot_study_directions_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_pivot_study_directions` ADD CONSTRAINT `university_pivot_study_directions_study_direction_id_fkey` FOREIGN KEY (`study_direction_id`) REFERENCES `study_directions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `study_direction_translations` ADD CONSTRAINT `study_direction_translations_study_direction_id_fkey` FOREIGN KEY (`study_direction_id`) REFERENCES `study_directions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_category_translations` ADD CONSTRAINT `blog_category_translations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_articles` ADD CONSTRAINT `blog_articles_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_article_translations` ADD CONSTRAINT `blog_article_translations_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `blog_articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_pivot_featured_programs` ADD CONSTRAINT `university_pivot_featured_programs_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_pivot_featured_programs` ADD CONSTRAINT `university_pivot_featured_programs_university_program_id_fkey` FOREIGN KEY (`university_program_id`) REFERENCES `university_programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_pivot_featured_program_translations` ADD CONSTRAINT `university_pivot_featured_program_translations_university_p_fkey` FOREIGN KEY (`university_pivot_featured_program_id`) REFERENCES `university_pivot_featured_programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

