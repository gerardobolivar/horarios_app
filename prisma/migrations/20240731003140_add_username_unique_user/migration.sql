/*
  Warnings:

  - A unique constraint covering the columns `[nombre_usuario]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `nombre_usuario` VARCHAR(50) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_nombre_usuario_key` ON `User`(`nombre_usuario`);
