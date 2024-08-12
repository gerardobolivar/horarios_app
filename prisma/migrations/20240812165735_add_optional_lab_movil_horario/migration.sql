-- DropForeignKey
ALTER TABLE `Matricula` DROP FOREIGN KEY `Matricula_laboratorio_movil_id_fkey`;

-- AlterTable
ALTER TABLE `Matricula` MODIFY `laboratorio_movil_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_laboratorio_movil_id_fkey` FOREIGN KEY (`laboratorio_movil_id`) REFERENCES `LaboratorioMovil`(`id_lab_mov`) ON DELETE SET NULL ON UPDATE CASCADE;
