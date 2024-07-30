-- CreateTable
CREATE TABLE `Hash` (
    `id_hash` INTEGER NOT NULL AUTO_INCREMENT,
    `salt` CHAR(32) NOT NULL,
    `hash` CHAR(64) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `fecha_modificado` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Hash_user_id_key`(`user_id`),
    PRIMARY KEY (`id_hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hash` ADD CONSTRAINT `Hash_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
