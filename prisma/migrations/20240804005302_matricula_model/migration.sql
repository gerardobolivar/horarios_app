-- CreateTable
CREATE TABLE `Matricula` (
    `matricula_id` INTEGER NOT NULL AUTO_INCREMENT,
    `hora_inicio` VARCHAR(191) NOT NULL,
    `hora_final` VARCHAR(191) NOT NULL,
    `dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO') NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_modificado` DATETIME(3) NOT NULL,
    `curso_id` INTEGER NOT NULL,
    `aula_id` INTEGER NOT NULL,
    `laboratorio_movil_id` INTEGER NOT NULL,
    `horario_id` INTEGER NOT NULL,

    PRIMARY KEY (`matricula_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horario` (
    `horario_id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `ciclo_id` INTEGER NOT NULL,

    PRIMARY KEY (`horario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ciclo` (
    `ciclo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL DEFAULT 'Ciclo',
    `active` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`ciclo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_curso_id_fkey` FOREIGN KEY (`curso_id`) REFERENCES `Curso`(`id_curso`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_aula_id_fkey` FOREIGN KEY (`aula_id`) REFERENCES `Aula`(`id_aula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_laboratorio_movil_id_fkey` FOREIGN KEY (`laboratorio_movil_id`) REFERENCES `LaboratorioMovil`(`id_lab_mov`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_horario_id_fkey` FOREIGN KEY (`horario_id`) REFERENCES `Horario`(`horario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horario` ADD CONSTRAINT `Horario_ciclo_id_fkey` FOREIGN KEY (`ciclo_id`) REFERENCES `Ciclo`(`ciclo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
