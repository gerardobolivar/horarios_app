/*
  Warnings:

  - A unique constraint covering the columns `[groupNumber,course_id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupNumber` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Group_group_id_course_id_key` ON `Group`;

-- AlterTable
ALTER TABLE `Group` ADD COLUMN `groupNumber` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Group_groupNumber_course_id_key` ON `Group`(`groupNumber`, `course_id`);
