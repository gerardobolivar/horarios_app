/*
  Warnings:

  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` VARCHAR(50) NOT NULL DEFAULT 'USER';
