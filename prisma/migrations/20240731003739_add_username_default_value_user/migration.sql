/*
  Warnings:

  - Made the column `nombre_usuario` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `nombre_usuario` VARCHAR(50) NOT NULL DEFAULT '';
