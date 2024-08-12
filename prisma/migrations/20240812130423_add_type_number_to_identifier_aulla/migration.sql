/*
  Warnings:

  - You are about to alter the column `identificador` on the `Aula` table. The data in that column could be lost. The data in that column will be cast from `VarChar(45)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Aula` MODIFY `identificador` INTEGER NOT NULL;
