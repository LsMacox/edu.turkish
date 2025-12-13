-- Optimize university indexes
-- Remove unused indexes and split compound tuition index

-- Drop unused indexes
DROP INDEX `idx_university_accommodation` ON `universities`;
DROP INDEX `idx_university_scholarships` ON `universities`;
DROP INDEX `idx_university_founded_year` ON `universities`;
DROP INDEX `idx_university_total_students` ON `universities`;
DROP INDEX `idx_university_international_students` ON `universities`;
DROP INDEX `idx_university_country` ON `universities`;
DROP INDEX `idx_university_tuition` ON `universities`;

-- Create separate indexes for tuition (more flexible for different sort orders)
CREATE INDEX `idx_university_tuition_min` ON `universities`(`tuition_min`);
CREATE INDEX `idx_university_tuition_max` ON `universities`(`tuition_max`);
