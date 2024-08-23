/*
  Warnings:

  - A unique constraint covering the columns `[ciclo_id]` on the table `Horario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Horario` DROP FOREIGN KEY `Horario_ciclo_id_fkey`;

-- AlterTable
ALTER TABLE `Horario` MODIFY `ciclo_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Horario_ciclo_id_key` ON `Horario`(`ciclo_id`);

-- AddForeignKey
ALTER TABLE `Horario` ADD CONSTRAINT `Horario_ciclo_id_fkey` FOREIGN KEY (`ciclo_id`) REFERENCES `Ciclo`(`ciclo_id`) ON DELETE SET NULL ON UPDATE CASCADE;
