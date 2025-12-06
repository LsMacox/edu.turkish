/*
  Warnings:

  - You are about to drop the `service_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_category_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_service_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `service_category_translations` DROP FOREIGN KEY `service_category_translations_service_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_service_translations` DROP FOREIGN KEY `sub_service_translations_sub_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_services` DROP FOREIGN KEY `sub_services_service_category_id_fkey`;

-- DropTable
DROP TABLE `service_categories`;

-- DropTable
DROP TABLE `service_category_translations`;

-- DropTable
DROP TABLE `sub_service_translations`;

-- DropTable
DROP TABLE `sub_services`;
