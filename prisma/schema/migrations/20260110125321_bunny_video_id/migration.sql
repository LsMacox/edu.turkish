/*
  Warnings:

  - You are about to drop the column `video_duration` on the `university_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `video_thumb` on the `university_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `university_reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `university_reviews` DROP COLUMN `video_duration`,
    DROP COLUMN `video_thumb`,
    DROP COLUMN `video_url`,
    ADD COLUMN `video_id` VARCHAR(100) NULL;

-- CreateIndex
CREATE INDEX `idx_application_status` ON `applications`(`status`);

-- CreateIndex
CREATE INDEX `idx_application_submitted_at` ON `applications`(`submitted_at`);

-- CreateIndex
CREATE INDEX `idx_application_referral` ON `applications`(`referral_code`);

-- CreateIndex
CREATE INDEX `idx_application_source` ON `applications`(`source`);

-- CreateIndex
CREATE INDEX `idx_blog_article_translation_locale` ON `blog_article_translations`(`locale`);

-- CreateIndex
CREATE INDEX `idx_blog_article_is_power_page` ON `blog_articles`(`is_power_page`);

-- CreateIndex
CREATE INDEX `idx_blog_article_is_featured` ON `blog_articles`(`is_featured`);

-- CreateIndex
CREATE INDEX `idx_blog_article_status_published` ON `blog_articles`(`status`, `published_at`);

-- CreateIndex
CREATE INDEX `idx_blog_category_order` ON `blog_categories`(`order`);

-- CreateIndex
CREATE INDEX `idx_faq_featured` ON `faqs`(`featured`);

-- CreateIndex
CREATE INDEX `idx_date_upcoming` ON `university_important_dates`(`date`);

-- CreateIndex
CREATE INDEX `idx_media_university_kind` ON `university_media_assets`(`university_id`, `kind`);

-- CreateIndex
CREATE INDEX `idx_program_university_language` ON `university_programs`(`university_id`, `languageCode`);

-- CreateIndex
CREATE INDEX `idx_review_featured_media` ON `university_reviews`(`featured`, `media_type`);

-- CreateIndex
CREATE INDEX `idx_university_translation_locale` ON `university_translations`(`locale`);

-- RenameIndex
ALTER TABLE `exchange_rates` RENAME INDEX `exchange_rates_expires_at_idx` TO `idx_exchange_rate_expires`;

-- RenameIndex
ALTER TABLE `faqs` RENAME INDEX `faqs_categoryId_fkey` TO `idx_faq_category`;

-- RenameIndex
ALTER TABLE `university_pivot_study_directions` RENAME INDEX `university_pivot_study_directions_study_direction_id_fkey` TO `idx_pivot_direction`;
