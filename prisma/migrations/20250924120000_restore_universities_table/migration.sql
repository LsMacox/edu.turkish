-- Revert base university table rename
RENAME TABLE `university_profiles` TO `universities`;
RENAME TABLE `university_profile_translations` TO `university_translations`;

-- Restore foreign key column names referencing the base university table
ALTER TABLE `university_translations`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_programs`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_reviews`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_media_assets`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_campus_facilities`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_admission_requirements`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_required_documents`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_important_dates`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_scholarships`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_pivot_featured_programs`
  RENAME COLUMN `university_profile_id` TO `university_id`;

ALTER TABLE `university_pivot_study_directions`
  RENAME COLUMN `university_profile_id` TO `university_id`;
