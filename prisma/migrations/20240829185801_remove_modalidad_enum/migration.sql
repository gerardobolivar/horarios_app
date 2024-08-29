/*
  Warnings:

  - You are about to alter the column `dia` on the `Matricula` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Matricula` MODIFY `dia` VARCHAR(191) NOT NULL;
