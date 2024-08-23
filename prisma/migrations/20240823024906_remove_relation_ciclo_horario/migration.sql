/*
  Warnings:

  - You are about to drop the column `ciclo_id` on the `Horario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Horario` DROP FOREIGN KEY `Horario_ciclo_id_fkey`;

-- AlterTable
ALTER TABLE `Horario` DROP COLUMN `ciclo_id`;
