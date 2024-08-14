/*
  Warnings:

  - You are about to drop the column `matricula_id` on the `LockedTimes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dia,aula_id,hora_inicio,hora_final]` on the table `LockedTimes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `LockedTimes` DROP FOREIGN KEY `LockedTimes_matricula_id_fkey`;

-- DropIndex
DROP INDEX `LockedTimes_dia_aula_id_hora_inicio_hora_final_matricula_id_key` ON `LockedTimes`;

-- AlterTable
ALTER TABLE `LockedTimes` DROP COLUMN `matricula_id`;

-- CreateIndex
CREATE UNIQUE INDEX `LockedTimes_dia_aula_id_hora_inicio_hora_final_key` ON `LockedTimes`(`dia`, `aula_id`, `hora_inicio`, `hora_final`);
