-- CreateTable
CREATE TABLE `LockedTimes` (
    `id_locked_time` INTEGER NOT NULL AUTO_INCREMENT,
    `dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO') NOT NULL,
    `aula_id` INTEGER NOT NULL,
    `hora_inicio` INTEGER NOT NULL,
    `hora_final` INTEGER NOT NULL,
    `matricula_id` INTEGER NOT NULL,

    UNIQUE INDEX `LockedTimes_dia_aula_id_hora_inicio_hora_final_matricula_id_key`(`dia`, `aula_id`, `hora_inicio`, `hora_final`, `matricula_id`),
    PRIMARY KEY (`id_locked_time`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LockedTimes` ADD CONSTRAINT `LockedTimes_matricula_id_fkey` FOREIGN KEY (`matricula_id`) REFERENCES `Matricula`(`matricula_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
