-- CreateTable
CREATE TABLE "User" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_usuario" VARCHAR(50) NOT NULL DEFAULT '',
    "role" VARCHAR(50) NOT NULL DEFAULT 'USER',
    "ultima_sesion" TIMESTAMP(3),
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,
    "resetPassword" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "PlanEstudio" (
    "id_plan_estudio" SERIAL NOT NULL,
    "nombre_plan" VARCHAR(100) NOT NULL,
    "codigo" VARCHAR(10),
    "usuario_id" INTEGER NOT NULL,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanEstudio_pkey" PRIMARY KEY ("id_plan_estudio")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id_curso" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "horas" VARCHAR(2) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "sigla" VARCHAR(10) NOT NULL,
    "tipoCurso" VARCHAR(2) NOT NULL,
    "ubicacion" CHAR(1) NOT NULL DEFAULT '1',
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id_aula" SERIAL NOT NULL,
    "identificador" INTEGER NOT NULL,
    "cupo" INTEGER NOT NULL,
    "detalle" VARCHAR(100) NOT NULL,
    "edificio" VARCHAR(45) NOT NULL,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id_aula")
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id_profesor" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "primer_apellido" VARCHAR(45) NOT NULL,
    "segundo_apellido" VARCHAR(45) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id_profesor")
);

-- CreateTable
CREATE TABLE "LaboratorioMovil" (
    "id_lab_mov" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "detalle" VARCHAR(400) NOT NULL,
    "profesor_id" INTEGER NOT NULL,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaboratorioMovil_pkey" PRIMARY KEY ("id_lab_mov")
);

-- CreateTable
CREATE TABLE "Hash" (
    "id_hash" SERIAL NOT NULL,
    "salt" CHAR(32) NOT NULL,
    "hash" CHAR(128) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hash_pkey" PRIMARY KEY ("id_hash")
);

-- CreateTable
CREATE TABLE "Matricula" (
    "matricula_id" SERIAL NOT NULL,
    "modalidad" TEXT NOT NULL DEFAULT 'PRESENCIAL',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,
    "laboratorio_movil_id" INTEGER,
    "horario_id" INTEGER NOT NULL,
    "color" CHAR(6) NOT NULL DEFAULT 'f0f0f0',
    "user_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("matricula_id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "horario_id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("horario_id")
);

-- CreateTable
CREATE TABLE "Ciclo" (
    "ciclo_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL DEFAULT 'Ciclo',
    "horario_id" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ciclo_pkey" PRIMARY KEY ("ciclo_id")
);

-- CreateTable
CREATE TABLE "ActiveCycle" (
    "active_cycle_id" INTEGER NOT NULL DEFAULT 1,
    "ciclo_id" INTEGER,

    CONSTRAINT "ActiveCycle_pkey" PRIMARY KEY ("active_cycle_id")
);

-- CreateTable
CREATE TABLE "Group" (
    "group_id" SERIAL NOT NULL,
    "groupNumber" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "matricula_id" INTEGER NOT NULL,
    "profesor_id" INTEGER NOT NULL,
    "Ahours" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "Time_span" (
    "time_span_id" SERIAL NOT NULL,
    "matricula_id" INTEGER NOT NULL,
    "aula_id" INTEGER NOT NULL,
    "hora_inicio" INTEGER NOT NULL,
    "hora_final" INTEGER NOT NULL,
    "dia" TEXT NOT NULL,
    "type" CHAR(2),
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Time_span_pkey" PRIMARY KEY ("time_span_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nombre_usuario_key" ON "User"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Aula_identificador_key" ON "Aula"("identificador");

-- CreateIndex
CREATE UNIQUE INDEX "LaboratorioMovil_profesor_id_key" ON "LaboratorioMovil"("profesor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hash_user_id_key" ON "Hash"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ciclo_horario_id_key" ON "Ciclo"("horario_id");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveCycle_ciclo_id_key" ON "ActiveCycle"("ciclo_id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_matricula_id_key" ON "Group"("matricula_id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupNumber_course_id_key" ON "Group"("groupNumber", "course_id");

-- AddForeignKey
ALTER TABLE "PlanEstudio" ADD CONSTRAINT "PlanEstudio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "PlanEstudio"("id_plan_estudio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor" ADD CONSTRAINT "Profesor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaboratorioMovil" ADD CONSTRAINT "LaboratorioMovil_profesor_id_fkey" FOREIGN KEY ("profesor_id") REFERENCES "Profesor"("id_profesor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hash" ADD CONSTRAINT "Hash_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_laboratorio_movil_id_fkey" FOREIGN KEY ("laboratorio_movil_id") REFERENCES "LaboratorioMovil"("id_lab_mov") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "Horario"("horario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ciclo" ADD CONSTRAINT "Ciclo_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "Horario"("horario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveCycle" ADD CONSTRAINT "ActiveCycle_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "Ciclo"("ciclo_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "Matricula"("matricula_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_profesor_id_fkey" FOREIGN KEY ("profesor_id") REFERENCES "Profesor"("id_profesor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time_span" ADD CONSTRAINT "Time_span_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "Matricula"("matricula_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time_span" ADD CONSTRAINT "Time_span_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "Aula"("id_aula") ON DELETE RESTRICT ON UPDATE CASCADE;
