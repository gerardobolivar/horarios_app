/*
  Warnings:

  - Made the column `plan_id` on table `curso` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Curso` DROP FOREIGN KEY `Curso_plan_id_fkey`;

-- AlterTable
ALTER TABLE `Curso` MODIFY `plan_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Curso` ADD CONSTRAINT `Curso_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `PlanEstudio`(`id_plan_estudio`) ON DELETE RESTRICT ON UPDATE CASCADE;
