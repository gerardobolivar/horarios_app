/*
  Warnings:

  - Added the required column `profesor_id` to the `Matricula` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Matricula` ADD COLUMN `profesor_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_profesor_id_fkey` FOREIGN KEY (`profesor_id`) REFERENCES `Profesor`(`id_profesor`) ON DELETE RESTRICT ON UPDATE CASCADE;
