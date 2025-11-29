/*
  Warnings:

  - You are about to drop the `university_pivot_featured_programs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `university_pivot_featured_programs` DROP FOREIGN KEY `university_pivot_featured_programs_university_id_fkey`;

-- DropForeignKey
ALTER TABLE `university_pivot_featured_programs` DROP FOREIGN KEY `university_pivot_featured_programs_university_program_id_fkey`;

-- DropTable
DROP TABLE `university_pivot_featured_programs`;
