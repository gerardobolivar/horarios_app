import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import Filters from "./filters";
import { TIMES_TITLE,TIMESLOTS} from "~/.server/allowedTimes";
import { getAulas } from "prisma/models/aulaModel";
import { filterMatriculas } from "prisma/models/matriculaModelo";
import TimeColumn from "./timeColumn";
import ClassroomColumn from "./classroomColumn";
import appStyles from '~/stylesheets/plan_.new.css?url';
import { getPlanes } from "prisma/models/planEstudioModel";
import { Matricula, Planes } from "~/types/horarioTypes";
import { Dias } from "@prisma/client";

export default function () {
  const data = useLoaderData<typeof loader>();
  const timeSlotsTitle: string[] = data.timesTitle
  const timeSlots: string[] = Object.values(data.timeSlots);
  const classrooms = Object.values(data.aulas).map(a => a.identificador);
  const matriculas = data.matriculas;
  
  return <>
    <Form method="POST">
      <Link to={`/horario/${data.idHorario}/new`}>
        <button className="mainButton">Agregar</button>
      </Link>
    </Form>
    <Filters data={data} horarioId={data.idHorario} planes={data.planes}></Filters>
    <div
      className="schedule"
      style={{ gridTemplateColumns: `100px repeat(${classrooms.length},300px)` }}>
      <TimeColumn slots={timeSlotsTitle}></TimeColumn>
      {
        data.aulas.map((classroom, index) => {
          return <ClassroomColumn
            nombreAula={classroom.identificador}
            timeSlots={timeSlots}
            index={index}
            matriculas={matriculas.filter(m => m.aula.identificador === classroom.identificador)}
            horarioId={data.idHorario}
            aula_id={classroom.id_aula}
            key={classroom.identificador}></ClassroomColumn>
        })
      }
      <Outlet/>
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
  const id_plan_estudio = Number(id_plan_estudioParam) === 0 ? undefined : id_plan_estudioParam !== null ? Number(id_plan_estudioParam):undefined;
  const dia = url.searchParams.get("dia") as Dias || Dias.LUNES;
  const ubicacionParam = url.searchParams.get("ubicacion");
  const ubicacion = ubicacionParam === null ? undefined : (ubicacionParam != null && ubicacionParam != "0" ? ubicacionParam:undefined);
  const idHorario: number = Number(params.idhorario);
  const aulas = await getAulas();
  const timeSlots = TIMESLOTS;
  const timesTitle = TIMES_TITLE;
  const planes:Planes = await getPlanes();
  let matriculas:Matricula[];
  
  matriculas = await filterMatriculas(idHorario,dia,id_plan_estudio,ubicacion)
  
  return json({ idHorario: idHorario,
                timesTitle:timesTitle,
                timeSlots: timeSlots,
                aulas: aulas,
                matriculas: matriculas,
                planes:planes });
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles }
];