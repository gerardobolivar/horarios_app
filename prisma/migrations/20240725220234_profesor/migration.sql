-- CreateTable
CREATE TABLE `Profesor` (
    `id_profesor` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `primer_apellido` VARCHAR(45) NOT NULL,
    `segundo_apellido` VARCHAR(45) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_modificado` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_profesor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
