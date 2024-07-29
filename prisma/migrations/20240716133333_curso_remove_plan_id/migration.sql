/*
  Warnings:

  - You are about to drop the column `plan_id` on the `curso` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Curso` DROP FOREIGN KEY `Curso_plan_id_fkey`;

-- AlterTable
ALTER TABLE `Curso` DROP COLUMN `plan_id`;
