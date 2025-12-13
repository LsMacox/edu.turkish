-- AlterTable: Add key column to faq_categories
ALTER TABLE `faq_categories` ADD COLUMN `key` VARCHAR(50) NULL;

-- Populate key values based on existing category translations (Russian names)
UPDATE `faq_categories` fc
JOIN `faq_category_translations` fct ON fc.id = fct.category_id AND fct.locale = 'ru'
SET fc.`key` = CASE fct.name
    WHEN 'Документы' THEN 'documents'
    WHEN 'Технологии' THEN 'technology'
    WHEN 'Образование' THEN 'education'
    WHEN 'ВНЖ' THEN 'residence'
    WHEN 'Переезд' THEN 'relocation'
    WHEN 'Страхование' THEN 'insurance'
    WHEN 'Транспорт' THEN 'transport'
    WHEN 'Жилье' THEN 'housing'
    ELSE LOWER(REPLACE(fct.name, ' ', '_'))
END;

-- Make key column NOT NULL and UNIQUE after population
ALTER TABLE `faq_categories` MODIFY COLUMN `key` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `faq_categories_key_key` ON `faq_categories`(`key`);
