/*
  Warnings:

  - You are about to drop the column `plan_id` on the `curso` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `curso` DROP FOREIGN KEY `Curso_plan_id_fkey`;

-- AlterTable
ALTER TABLE `curso` DROP COLUMN `plan_id`;
