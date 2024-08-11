import { Dias } from "@prisma/client"

 interface Curso{
  id_curso: number,
  nombre: string,
  plan_id: number,
  horas: string,
  tipoCurso: string,
  ubicacion:string,
  sigla: string
}
interface Aula{
  id_aula: number;
  identificador: string;
  cupo: number;
  detalle: string;
  edificio: string;
}

type Aulas = Aula[]

interface Plan{
  id_plan_estudio:number,
  nombre_plan:string
}

type Planes = Plan[]

interface Matricula {
  aula:Aula,
  matricula_id: number,
  dia: Dias,
  curso: Curso,
  hora_inicio: number;
  hora_final: number; 
}

type Matriculas = Matricula[];

export type {Curso, Plan, Planes, Matricula, Matriculas}