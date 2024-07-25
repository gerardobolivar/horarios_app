-- CreateTable
CREATE TABLE `Aula` (
    `id_aula` INTEGER NOT NULL AUTO_INCREMENT,
    `identificador` VARCHAR(45) NOT NULL,
    `cupo` INTEGER NOT NULL,
    `detalle` VARCHAR(100) NOT NULL,
    `edificio` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id_aula`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
