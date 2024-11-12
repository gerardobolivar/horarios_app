-- CreateTable
CREATE TABLE "HorarioCloseTime" (
    "horario_close_time_id" SERIAL NOT NULL,
    "datetime" CHAR(24) NOT NULL,
    "horario_id" INTEGER NOT NULL,

    CONSTRAINT "HorarioCloseTime_pkey" PRIMARY KEY ("horario_close_time_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HorarioCloseTime_horario_id_key" ON "HorarioCloseTime"("horario_id");

-- AddForeignKey
ALTER TABLE "HorarioCloseTime" ADD CONSTRAINT "HorarioCloseTime_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "Horario"("horario_id") ON DELETE RESTRICT ON UPDATE CASCADE;
