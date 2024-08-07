import { LinksFunction, json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Filters from "./filters";
import TIMES from "~/.server/allowedTimes";
import { getAulas } from "prisma/models/aulaModel";
import { useMemo } from "react";
import { getMatriculas } from "prisma/models/matriculaModelo";
import localStyles from "./horario.css?url";
import { TIMESLOTS } from "./data";
import TimeColumn from "./timeColumn";
import ClassroomColumn from "./classroomColumn";

function MainTitle({ titleText = "Horario" }) {
  return (
    <div className="main-title">
      <h1>{titleText}</h1>
    </div>
  );
};

export default function Horario() {
  const data = useLoaderData<typeof loader>();
  const timeSlotsTitle: string[] = Object.values(TIMESLOTS);
  const timeSlots: string[] = Object.values(TIMESLOTS);
  const classrooms = Object.values(data.aulas).map(a => a.identificador);
  const matriculas = data.matriculas;
  useMemo(() => timeSlotsTitle.unshift("HORAS"), [timeSlotsTitle])

  return (
    <>
      <div className="">
        <MainTitle titleText="Horario" />
      </div>
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
  );
}

export const loader = async () => {
  const allowedTimes = TIMES;
  const aulas = await getAulas();
  const matriculas = await getMatriculas();
  console.log(matriculas);

  return json({ allowedTimes: allowedTimes, aulas: aulas, matriculas: matriculas, ok: true });
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: localStyles },
];