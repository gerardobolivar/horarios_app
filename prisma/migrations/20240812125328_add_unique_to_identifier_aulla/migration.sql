/*
  Warnings:

  - A unique constraint covering the columns `[identificador]` on the table `Aula` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Aula_identificador_key` ON `Aula`(`identificador`);
