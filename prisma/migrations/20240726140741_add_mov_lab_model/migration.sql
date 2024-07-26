-- CreateTable
CREATE TABLE `LaboratorioMovil` (
    `id_lab_mov` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `detalle` VARCHAR(100) NOT NULL,
    `profesor_id` INTEGER NOT NULL,
    `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_modificado` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LaboratorioMovil_profesor_id_key`(`profesor_id`),
    PRIMARY KEY (`id_lab_mov`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LaboratorioMovil` ADD CONSTRAINT `LaboratorioMovil_profesor_id_fkey` FOREIGN KEY (`profesor_id`) REFERENCES `Profesor`(`id_profesor`) ON DELETE RESTRICT ON UPDATE CASCADE;
