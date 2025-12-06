-- AlterTable
ALTER TABLE `blog_articles` ADD COLUMN `is_program` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `blog_categories` ADD COLUMN `image` VARCHAR(500) NULL,
    ADD COLUMN `is_program` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `idx_blog_article_is_program` ON `blog_articles`(`is_program`);

-- CreateIndex
CREATE INDEX `idx_blog_category_is_program` ON `blog_categories`(`is_program`);
