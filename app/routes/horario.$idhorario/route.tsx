import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import Filters from "./filters";
import { TIMES_TITLE,TIMESLOTS} from "~/.server/allowedTimes";
import { getAulas } from "prisma/models/aulaModel";
import { getMatriculasByHorario } from "prisma/models/matriculaModelo";
import TimeColumn from "./timeColumn";
import ClassroomColumn from "./classroomColumn";

export default function () {
  const data = useLoaderData<typeof loader>();
  const timeSlotsTitle: string[] = data.timesTitle
  const timeSlots: string[] = Object.values(data.timeSlots);
  const classrooms = Object.values(data.aulas).map(a => a.identificador);
  const matriculas = data.matriculas;

  return <>
    <Form method="POST">
      <Link to={"/horario/"}>
        <button className="mainButton">Agregar</button>
      </Link>
    </Form>
    <Filters data={data} ></Filters>
    <div
      className="schedule"
      style={{ gridTemplateColumns: `100px repeat(${classrooms.length},300px)` }}>
      <TimeColumn slots={timeSlotsTitle}></TimeColumn>
      {
        classrooms.map((classroom, index) => {
          return <ClassroomColumn
            nombreAula={classroom}
            timeSlots={timeSlots}
            index={index}
            matriculas={matriculas.filter(m => m.aula.identificador === classroom)}
            key={classroom}></ClassroomColumn>
        })
      }
    </div>
  </>
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const idHorario: string = String(params.idhorario);
  const matriculas = await getMatriculasByHorario(Number(idHorario))
  const aulas = await getAulas();
  const timeSlots = TIMESLOTS;
  const timesTitle = TIMES_TITLE;
  return json({ timesTitle:timesTitle, timeSlots: timeSlots, aulas: aulas, matriculas: matriculas });
}