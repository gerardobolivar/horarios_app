-- CreateTable
CREATE TABLE `User` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_usuario` VARCHAR(255) NOT NULL,
    `tipo` CHAR(3) NOT NULL,
    `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_modificado` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanEstudio` (
    `id_plan_estudio` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_plan` VARCHAR(100) NOT NULL,
    `codigo` VARCHAR(10) NULL,
    `usuario_id` INTEGER NOT NULL,
    `fecha_creado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_modificado` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_plan_estudio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanEstudio` ADD CONSTRAINT `PlanEstudio_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `User`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
