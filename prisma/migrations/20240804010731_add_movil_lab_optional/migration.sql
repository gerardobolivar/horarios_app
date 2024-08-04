/*
  Warnings:

  - Added the required column `laboratorio_movil_id` to the `Matricula` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Matricula` ADD COLUMN `laboratorio_movil_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_laboratorio_movil_id_fkey` FOREIGN KEY (`laboratorio_movil_id`) REFERENCES `LaboratorioMovil`(`id_lab_mov`) ON DELETE RESTRICT ON UPDATE CASCADE;
