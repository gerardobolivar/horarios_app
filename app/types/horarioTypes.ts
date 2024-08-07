import { Dias } from "@prisma/client"

 type Curso = {
  id_curso: number,
  nombre: string,
  sigla: string

}

type Matricula = {
  matricula_id: number,
  dia: Dias,
  curso: Curso,
  hora_inicio: number;
  hora_final: number; 
}

type Matriculas = Matricula[];

export type {Curso, Matricula, Matriculas}