/*
  Warnings:

  - The `visible` column on the `Horario` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Horario" DROP COLUMN "visible",
ADD COLUMN     "visible" CHAR(1);
