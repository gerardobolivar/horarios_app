import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import Filters from "./filters";
import { TIMES_TITLE, TIMESLOTS } from "~/.server/allowedTimes";
import { getAulas } from "prisma/models/aulaModel";
import { filterMatriculas, getVirtualMatriculas } from "prisma/models/matriculaModelo";
import TimeColumn from "./timeColumn";
import ClassroomColumn from "./classroomColumn";
import appStyles from '~/stylesheets/plan_.new.css?url';
import horarioStyles from './horarioStyles.css?url';
import { getPlanes } from "prisma/models/planEstudioModel";
import { Matricula, Planes } from "~/types/horarioTypes";
import VirtualCourses from "./VirtualCourses";

export default function () {
  const data = useLoaderData<typeof loader>();
  const timeSlotsTitle: string[] = data.timesTitle
  const timeSlots: string[] = Object.values(data.timeSlots);
  const classrooms = Object.values(data.aulas).map(a => a.identificador);
  const matriculas = data.matriculas;
  const showVirtual = data.cursosVirtuales.length > 0 ? true : false;
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const hideEmpty = searchParams.get("hideempty") === "false" || searchParams.get("hideempty") === null ? false : true;
  

  const listaClassroom = data.aulas.map((classroom, index) => {
    return classroom.identificador !== 999 ? <ClassroomColumn
      nombreAula={classroom.identificador}
      timeSlots={timeSlots}
      index={index}
      matriculas={matriculas.filter(m => m.aula.identificador === classroom.identificador)}
      horarioId={data.idHorario}
      aula_id={classroom.id_aula}
      key={classroom.identificador}></ClassroomColumn> : null
  })

  const listaClassroomHidden = data.aulas.map((classroom, index) => {
    const mtr = matriculas.filter(m => m.aula.identificador === classroom.identificador);
    return classroom.identificador !== 999 && mtr.length >= 1 ? <ClassroomColumn
      nombreAula={classroom.identificador}
      timeSlots={timeSlots}
      index={index}
      matriculas={mtr}
      horarioId={data.idHorario}
      aula_id={classroom.id_aula}
      key={classroom.identificador}></ClassroomColumn> : null
  })

  return <>
    <div className="filtersHorario">
      <Filters data={data} horarioId={data.idHorario} planes={data.planes}></Filters>
    </div>
    <Form method="POST">
      <Link to={`/horario/${data.idHorario}/new`}>
        <button className="mainButton">Registrar</button>
      </Link>
      <Link to={`/horario/${data.idHorario}/config`}>
        <button className="mainButton">Configurar | Botón temporal </button>
      </Link>
    </Form>
    <div
      className="schedule"
      style={{ gridTemplateColumns: `100px repeat(${classrooms.length},300px)` }}>
      <TimeColumn slots={timeSlotsTitle}></TimeColumn>
      {hideEmpty ? listaClassroomHidden : listaClassroom}
      <Outlet />
    </div>
    <div className="virtualCoursesContainer">
      {
        showVirtual ? <VirtualCourses matriculas={data.cursosVirtuales} horarioId={data.idHorario} showVirtual={showVirtual} /> : null
      }
    </div>
  </>
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  //const formData = await request.formData();
  return null;
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const id_plan_estudioParam = url.searchParams.get("planEstudios");
  const id_plan_estudio = Number(id_plan_estudioParam) === 0 ? undefined : id_plan_estudioParam !== null ? Number(id_plan_estudioParam) : undefined;
  const dia = url.searchParams.get("dia") || "LUNES";
  const ubicacionParam = url.searchParams.get("ubicacion");
  const ubicacion = ubicacionParam === null ? undefined : (ubicacionParam != null && ubicacionParam != "0" ? ubicacionParam : undefined);
  const idHorario: number = Number(params.idhorario);
  const aulas = await getAulas();
  const timeSlots = TIMESLOTS;
  const timesTitle = TIMES_TITLE;
  const planes: Planes = await getPlanes();
  const showVirtual: Boolean = url.searchParams.get("showvirtual") === "true" ? true : false;
  const cursosVirtuales: Matricula[] = showVirtual ? await getVirtualMatriculas(idHorario) : []
  let matriculas: Matricula[];
  matriculas = await filterMatriculas(idHorario, dia, id_plan_estudio, ubicacion)

  return json({
    idHorario: idHorario,
    timesTitle: timesTitle,
    timeSlots: timeSlots,
    aulas: aulas,
    matriculas: matriculas,
    cursosVirtuales: cursosVirtuales,
    planes: planes
  });
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: horarioStyles },

];