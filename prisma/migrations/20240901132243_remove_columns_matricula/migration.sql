/*
  Warnings:

  - You are about to drop the column `aula_id` on the `Matricula` table. All the data in the column will be lost.
  - You are about to drop the column `curso_id` on the `Matricula` table. All the data in the column will be lost.
  - You are about to drop the column `dia` on the `Matricula` table. All the data in the column will be lost.
  - You are about to drop the column `hora_final` on the `Matricula` table. All the data in the column will be lost.
  - You are about to drop the column `hora_inicio` on the `Matricula` table. All the data in the column will be lost.
  - You are about to drop the column `profesor_id` on the `Matricula` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Matricula` DROP FOREIGN KEY `Matricula_aula_id_fkey`;

-- DropForeignKey
ALTER TABLE `Matricula` DROP FOREIGN KEY `Matricula_curso_id_fkey`;

-- DropForeignKey
ALTER TABLE `Matricula` DROP FOREIGN KEY `Matricula_profesor_id_fkey`;

-- AlterTable
ALTER TABLE `Matricula` DROP COLUMN `aula_id`,
    DROP COLUMN `curso_id`,
    DROP COLUMN `dia`,
    DROP COLUMN `hora_final`,
    DROP COLUMN `hora_inicio`,
    DROP COLUMN `profesor_id`;
