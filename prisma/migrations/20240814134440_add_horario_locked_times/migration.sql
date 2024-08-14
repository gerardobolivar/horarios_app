/*
  Warnings:

  - A unique constraint covering the columns `[dia,aula_id,hora_inicio,hora_final,horario_id]` on the table `LockedTimes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `horario_id` to the `LockedTimes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `LockedTimes_dia_aula_id_hora_inicio_hora_final_key` ON `LockedTimes`;

-- AlterTable
ALTER TABLE `LockedTimes` ADD COLUMN `horario_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LockedTimes_dia_aula_id_hora_inicio_hora_final_horario_id_key` ON `LockedTimes`(`dia`, `aula_id`, `hora_inicio`, `hora_final`, `horario_id`);

-- AddForeignKey
ALTER TABLE `LockedTimes` ADD CONSTRAINT `LockedTimes_horario_id_fkey` FOREIGN KEY (`horario_id`) REFERENCES `Horario`(`horario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
