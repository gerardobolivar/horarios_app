
 interface Curso{
  id_curso: number,
  nombre: string,
  plan_id: number,
  horas: string,
  tipoCurso: string,
  ubicacion:string,
  sigla: string
}
type SCHEDULE_ERROR = {
  [key:string]: string;
};

const SCHEDULE_ERRORS: SCHEDULE_ERROR = {
  INAVALID_TIME_RANGE : "Rango de horas inválido.",
  NO_SCHEDULE_ASSIGMENT: "No se puede activar un ciclo sin un horario vinculado.",
  BUSSY_SCHEDULE: "El horario seleccionado ya está vinculado a un curso."
}

interface Aula{
  id_aula: number;
  identificador: number;
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
  dia: String,
  curso: Curso,
  modalidad: string;
  hora_inicio: number;
  hora_final: number; 
}

type Matriculas = Matricula[];

interface scheduleFilters {
  planEstudios: string,
  dia: string,
  ubicacion: string
  show_virtual: string
}

interface LockTime{  
  hora_inicio: number;
  hora_final: number;
  dia: String;
  aula_id: number;
  horario_id: number;
}

export type {Curso, Plan, Planes, Matricula, Matriculas, scheduleFilters, LockTime}
export {SCHEDULE_ERRORS};