-- AlterTable
ALTER TABLE `university_reviews` ADD COLUMN `image_url` VARCHAR(500) NULL,
    ADD COLUMN `media_type` ENUM('text', 'video', 'image') NOT NULL DEFAULT 'text',
    ADD COLUMN `video_duration` VARCHAR(10) NULL,
    ADD COLUMN `video_thumb` VARCHAR(500) NULL,
    ADD COLUMN `video_url` VARCHAR(500) NULL;

-- CreateIndex
CREATE INDEX `idx_review_media_type` ON `university_reviews`(`media_type`);
