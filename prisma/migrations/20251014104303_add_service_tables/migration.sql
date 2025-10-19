-- CreateTable
CREATE TABLE `service_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(100) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `service_categories_slug_key`(`slug`),
    INDEX `service_categories_slug_idx`(`slug`),
    INDEX `service_categories_is_active_order_idx`(`is_active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_category_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_category_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` TEXT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `service_category_translations_locale_idx`(`locale`),
    UNIQUE INDEX `service_category_translations_service_category_id_locale_key`(`service_category_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_category_id` INTEGER NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `price_usd` DECIMAL(10, 2) NOT NULL,
    `delivery_time_days` INTEGER NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `sub_services_service_category_id_is_active_order_idx`(`service_category_id`, `is_active`, `order`),
    UNIQUE INDEX `sub_services_service_category_id_slug_key`(`service_category_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_service_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sub_service_id` INTEGER NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `sub_service_translations_locale_idx`(`locale`),
    UNIQUE INDEX `sub_service_translations_sub_service_id_locale_key`(`sub_service_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exchange_rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `base_currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
    `target_currency` VARCHAR(3) NOT NULL,
    `rate` DECIMAL(12, 6) NOT NULL,
    `fetched_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,

    INDEX `exchange_rates_expires_at_idx`(`expires_at`),
    UNIQUE INDEX `exchange_rates_base_currency_target_currency_key`(`base_currency`, `target_currency`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_category_translations` ADD CONSTRAINT `service_category_translations_service_category_id_fkey` FOREIGN KEY (`service_category_id`) REFERENCES `service_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_services` ADD CONSTRAINT `sub_services_service_category_id_fkey` FOREIGN KEY (`service_category_id`) REFERENCES `service_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_service_translations` ADD CONSTRAINT `sub_service_translations_sub_service_id_fkey` FOREIGN KEY (`sub_service_id`) REFERENCES `sub_services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
