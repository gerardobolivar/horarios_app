-- CreateTable
CREATE TABLE `Curso` (
    `id_curso` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` INTEGER NOT NULL,
    `horas` VARCHAR(2) NOT NULL,
    `tipo` VARCHAR(2) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `sigla` VARCHAR(10) NOT NULL,
    `tipoCurso` VARCHAR(2) NOT NULL,
    `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_modificado` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Curso_plan_id_key`(`plan_id`),
    PRIMARY KEY (`id_curso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Curso` ADD CONSTRAINT `Curso_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `PlanEstudio`(`id_plan_estudio`) ON DELETE RESTRICT ON UPDATE CASCADE;
