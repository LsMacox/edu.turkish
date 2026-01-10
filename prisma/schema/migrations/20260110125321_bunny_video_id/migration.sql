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
