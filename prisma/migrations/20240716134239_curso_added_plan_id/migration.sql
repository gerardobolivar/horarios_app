-- AlterTable
ALTER TABLE `Curso` ADD COLUMN `plan_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Curso` ADD CONSTRAINT `Curso_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `PlanEstudio`(`id_plan_estudio`) ON DELETE SET NULL ON UPDATE CASCADE;
