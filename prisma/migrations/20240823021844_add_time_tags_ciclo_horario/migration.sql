/*
  Warnings:

  - Added the required column `fecha_modificado` to the `Ciclo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_modificado` to the `Horario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ciclo` ADD COLUMN `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fecha_modificado` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Horario` ADD COLUMN `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fecha_modificado` DATETIME(3) NOT NULL;
