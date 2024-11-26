/*
  Warnings:

  - A unique constraint covering the columns `[groupNumber,course_id,horario_id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Group_groupNumber_course_id_key";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "horario_id" INTEGER NOT NULL DEFAULT 3;

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupNumber_course_id_horario_id_key" ON "Group"("groupNumber", "course_id", "horario_id");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "Horario"("horario_id") ON DELETE RESTRICT ON UPDATE CASCADE;
