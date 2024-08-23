/*
  Warnings:

  - A unique constraint covering the columns `[horario_id]` on the table `Ciclo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Ciclo` ADD COLUMN `horario_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ciclo_horario_id_key` ON `Ciclo`(`horario_id`);

-- AddForeignKey
ALTER TABLE `Ciclo` ADD CONSTRAINT `Ciclo_horario_id_fkey` FOREIGN KEY (`horario_id`) REFERENCES `Horario`(`horario_id`) ON DELETE SET NULL ON UPDATE CASCADE;
