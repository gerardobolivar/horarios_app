-- CreateTable
CREATE TABLE `Group` (
    `group_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `matricula_id` INTEGER NOT NULL,
    `profesor_id` INTEGER NOT NULL,
    `Ahours` INTEGER NOT NULL,
    `completed` BOOLEAN NOT NULL,
    `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_modificado` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Group_group_id_course_id_key`(`group_id`, `course_id`),
    PRIMARY KEY (`group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Time_span` (
    `time_span_id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_id` INTEGER NOT NULL,
    `aula_id` INTEGER NOT NULL,
    `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_modificado` DATETIME(3) NOT NULL,

    PRIMARY KEY (`time_span_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Curso`(`id_curso`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_matricula_id_fkey` FOREIGN KEY (`matricula_id`) REFERENCES `Matricula`(`matricula_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_profesor_id_fkey` FOREIGN KEY (`profesor_id`) REFERENCES `Profesor`(`id_profesor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Time_span` ADD CONSTRAINT `Time_span_matricula_id_fkey` FOREIGN KEY (`matricula_id`) REFERENCES `Matricula`(`matricula_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Time_span` ADD CONSTRAINT `Time_span_aula_id_fkey` FOREIGN KEY (`aula_id`) REFERENCES `Aula`(`id_aula`) ON DELETE RESTRICT ON UPDATE CASCADE;
