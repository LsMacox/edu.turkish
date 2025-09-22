-- Rename tables to new naming convention
RENAME TABLE `universities` TO `university_profiles`;
RENAME TABLE `university_translations` TO `university_profile_translations`;
RENAME TABLE `university_media` TO `university_media_assets`;
RENAME TABLE `university_media_translations` TO `university_media_asset_translations`;
RENAME TABLE `academic_programs` TO `university_programs`;
RENAME TABLE `program_translations` TO `university_program_translations`;
RENAME TABLE `reviews` TO `university_reviews`;
RENAME TABLE `review_translations` TO `university_review_translations`;
RENAME TABLE `faq_items` TO `faqs`;
RENAME TABLE `campus_facilities` TO `university_campus_facilities`;
RENAME TABLE `facility_translations` TO `university_campus_facility_translations`;
RENAME TABLE `admission_requirements` TO `university_admission_requirements`;
RENAME TABLE `requirement_translations` TO `university_admission_requirement_translations`;
RENAME TABLE `required_documents` TO `university_required_documents`;
RENAME TABLE `document_translations` TO `university_required_document_translations`;
RENAME TABLE `important_dates` TO `university_important_dates`;
RENAME TABLE `date_translations` TO `university_important_date_translations`;
RENAME TABLE `scholarships` TO `university_scholarships`;
RENAME TABLE `scholarship_translations` TO `university_scholarship_translations`;
RENAME TABLE `featured_programs` TO `university_pivot_featured_programs`;
RENAME TABLE `featured_program_translations` TO `university_pivot_featured_program_translations`;
RENAME TABLE `university_directions` TO `university_pivot_study_directions`;
RENAME TABLE `direction_translations` TO `study_direction_translations`;

-- Rename foreign key columns to match table names
ALTER TABLE `university_profile_translations`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_programs`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_program_translations`
  RENAME COLUMN `program_id` TO `university_program_id`;

ALTER TABLE `university_reviews`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_review_translations`
  RENAME COLUMN `review_id` TO `university_review_id`;

ALTER TABLE `university_media_assets`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_media_asset_translations`
  RENAME COLUMN `media_id` TO `university_media_asset_id`;

ALTER TABLE `university_campus_facilities`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_campus_facility_translations`
  RENAME COLUMN `facility_id` TO `university_campus_facility_id`;

ALTER TABLE `university_admission_requirements`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_admission_requirement_translations`
  RENAME COLUMN `requirement_id` TO `university_admission_requirement_id`;

ALTER TABLE `university_required_documents`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_required_document_translations`
  RENAME COLUMN `document_id` TO `university_required_document_id`;

ALTER TABLE `university_important_dates`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_important_date_translations`
  RENAME COLUMN `date_id` TO `university_important_date_id`;

ALTER TABLE `university_scholarships`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_scholarship_translations`
  RENAME COLUMN `scholarship_id` TO `university_scholarship_id`;

ALTER TABLE `university_pivot_featured_programs`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_pivot_featured_programs`
  RENAME COLUMN `program_id` TO `university_program_id`;

ALTER TABLE `university_pivot_featured_program_translations`
  RENAME COLUMN `featured_program_id` TO `university_pivot_featured_program_id`;

ALTER TABLE `study_direction_translations`
  RENAME COLUMN `direction_id` TO `study_direction_id`;

ALTER TABLE `university_pivot_study_directions`
  RENAME COLUMN `university_id` TO `university_profile_id`;

ALTER TABLE `university_pivot_study_directions`
  RENAME COLUMN `direction_id` TO `study_direction_id`;

-- Drop unused pivot columns for university study directions
ALTER TABLE `university_pivot_study_directions`
  DROP INDEX `idx_university_direction_duration`,
  DROP INDEX `idx_university_direction_cost`;

ALTER TABLE `university_pivot_study_directions`
  DROP COLUMN `duration_years`,
  DROP COLUMN `cost_per_year`,
  DROP COLUMN `additional_info`;
