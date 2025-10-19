-- AlterTable
ALTER TABLE `service_categories` ADD COLUMN `express_multiplier` DECIMAL(5, 2) NOT NULL DEFAULT 1.50,
    ADD COLUMN `rush_multiplier` DECIMAL(5, 2) NOT NULL DEFAULT 2.00;

-- AlterTable
ALTER TABLE `sub_services` ADD COLUMN `type` ENUM('offering', 'calculator') NOT NULL DEFAULT 'offering';
