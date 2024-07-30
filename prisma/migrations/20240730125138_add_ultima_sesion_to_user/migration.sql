/*
  Warnings:

  - Added the required column `ultima_sesion` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `ultima_sesion` DATETIME(3) NOT NULL;
