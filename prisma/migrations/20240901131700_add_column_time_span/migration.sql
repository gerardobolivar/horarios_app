/*
  Warnings:

  - A unique constraint covering the columns `[matricula_id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dia` to the `Time_span` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Time_span` ADD COLUMN `dia` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Group_matricula_id_key` ON `Group`(`matricula_id`);
