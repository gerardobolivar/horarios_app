/*
  Warnings:

  - You are about to alter the column `hora_inicio` on the `Matricula` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `hora_final` on the `Matricula` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Matricula` MODIFY `hora_inicio` INTEGER NOT NULL,
    MODIFY `hora_final` INTEGER NOT NULL;
