-- CreateTable
CREATE TABLE `ActiveCycle` (
    `active_cycle_id` INTEGER NOT NULL DEFAULT 1,
    `ciclo_id` INTEGER NOT NULL,

    UNIQUE INDEX `ActiveCycle_ciclo_id_key`(`ciclo_id`),
    PRIMARY KEY (`active_cycle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActiveCycle` ADD CONSTRAINT `ActiveCycle_ciclo_id_fkey` FOREIGN KEY (`ciclo_id`) REFERENCES `Ciclo`(`ciclo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
