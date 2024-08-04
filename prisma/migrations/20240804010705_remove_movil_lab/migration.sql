/*
  Warnings:

  - You are about to drop the column `laboratorio_movil_id` on the `Matricula` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Matricula` DROP FOREIGN KEY `Matricula_laboratorio_movil_id_fkey`;

-- AlterTable
ALTER TABLE `Matricula` DROP COLUMN `laboratorio_movil_id`;
