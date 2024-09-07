/*
  Warnings:

  - Added the required column `hora_final` to the `Time_span` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hora_inicio` to the `Time_span` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Time_span` ADD COLUMN `hora_final` INTEGER NOT NULL,
    ADD COLUMN `hora_inicio` INTEGER NOT NULL;
