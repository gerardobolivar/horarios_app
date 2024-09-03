interface Time_span{
  //time_span_id: number;
    //matricula_id: number;
    aula: Aula;
    hora_inicio: number;
    hora_final: number;
    dia: string;
    //fecha_creado: Date;
    //fecha_modificado: Date;
}

interface ScheduleTimeSpans{
  time_span_id: number,
  matricula_id: number,
  aula_id: number,
  hora_inicio: number,
  hora_final: number,
  dia: string,
  fecha_creado: Date,
  fecha_modificado: Date,
  matricula: Matricula,
  aula:Aula,
}

interface Group_{
  group_id: number;
  // course_id: number;
  curso: Curso
  // matricula_id: number;
  // profesor_id: number;
  // Ahours: number;
  // completed: boolean;
  // fecha_creado: Date;
  // fecha_modificado: Date;
}

type Group = Group_ | null;
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
  matricula_id: number,
  time_spans: Time_span[]
  group: Group,
  modalidad: string; 
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
}

export type {Curso, Plan, Planes, Matricula, Matriculas, scheduleFilters, LockTime, Time_span, ScheduleTimeSpans}
export {SCHEDULE_ERRORS};