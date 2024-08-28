-- DropForeignKey
ALTER TABLE `ActiveCycle` DROP FOREIGN KEY `ActiveCycle_ciclo_id_fkey`;

-- AlterTable
ALTER TABLE `ActiveCycle` MODIFY `ciclo_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ActiveCycle` ADD CONSTRAINT `ActiveCycle_ciclo_id_fkey` FOREIGN KEY (`ciclo_id`) REFERENCES `Ciclo`(`ciclo_id`) ON DELETE SET NULL ON UPDATE CASCADE;
