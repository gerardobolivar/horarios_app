-- AlterTable
ALTER TABLE `Matricula` ADD COLUMN `user_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
