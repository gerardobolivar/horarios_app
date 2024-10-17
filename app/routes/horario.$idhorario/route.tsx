import { LinksFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import Filters from "./filters";
import TimeColumn from "./timeColumn";
import ClassroomColumn from "./classroomColumn";
import appStyles from '~/stylesheets/plan_.new.css?url';
import horarioStyles from './horarioStyles.css?url';
import VirtualCourses from "./VirtualCourses";
import { useOptionalUser } from "~/utils";
import HorarioLoader from "~/.server/Controller/horario.$idhorario/loader";
import HorarioAction from "~/.server/Controller/horario.$idhorario/action";
import { DIAS } from "./reversedTimes";

export default function () {
  const data = useLoaderData<typeof loader>();
  const timeSlotsTitle: string[] = data.timesTitle
  const timeSlots: string[] = Object.values(data.timeSlots);
  const classrooms = Object.values(data.aulas).map(a => a.identificador);
  const [searchParams, setSearchParams] = useSearchParams();
  const showVirtual = searchParams.get("showvirtual") === "true" ? true : false;
  const hideEmpty = searchParams.get("hideempty") === "false" || searchParams.get("hideempty") === null ? false : true;
  const scheduleTimeSpans = data.scheduleTimeSpans;
  const user = useOptionalUser();
  const isGuest = user?.role === "GUEST"

  function handleDrag(e: React.DragEvent) {
    // const scheduleUI = e.currentTarget;
    // (e.target as HTMLAnchorElement).textContent;
    // console.log(e)
  }

  const listaClassroom = 
    data.aulas.map((classroom, index) => {
    return classroom.identificador !== 999 ? <ClassroomColumn
      nombreAula={classroom.identificador}
      timeSlots={timeSlots}
      index={index}
      scheduleTimeSpans={scheduleTimeSpans.filter(s => s?.aula.identificador === classroom.identificador)} //matriculas.filter(m => m.aula.identificador === classroom.identificador)
      horarioId={data.idHorario}
      aula_id={classroom.id_aula}
      key={classroom.identificador}
      search={searchParams.toString()}></ClassroomColumn>: null
  })

  const listaClassroomHidden = 
    data.aulas.map((classroom, index) => {
    const sch = scheduleTimeSpans.filter(s => s?.aula.identificador === classroom.identificador); //matriculas.filter(m => m.aula.identificador === classroom.identificador)
    return classroom.identificador !== 999 && sch.length >= 1 ? <ClassroomColumn
      nombreAula={classroom.identificador}
      timeSlots={timeSlots}
      index={index}
      scheduleTimeSpans={sch}
      horarioId={data.idHorario}
      aula_id={classroom.id_aula}
      key={classroom.identificador}
      search={searchParams.toString()}></ClassroomColumn> : null
  })

  return <>
    <div className="grid_container_filter_config">
      <div className="filtersHorario">
        <Filters data={data} horarioId={data.idHorario} planes={data.planes}></Filters>
      </div>
      <div className="scheduleConfigBtn" hidden={user?.role !== "ADMIN"}>
        <Link to={`/horario/${data.idHorario}/config`}>
          <i className="bi bi-gear-fill gear-icon"></i>
        </Link>
      </div>
    </div>
    <Link hidden={isGuest} to={{
      pathname:`/horario/${data.idHorario}/new`,
      search: searchParams.toString()
    }}>
      <button className="mainButton">Registrar</button>
    </Link>

    <div className="grid_container">
      <div
        onDrag={handleDrag}
        className="mainScheduleUI">
        <h3 className="mainTitle mainTitleVirtualCourses">{DIAS[data.day]}</h3>
        <div
          className="schedule"
          style={{ gridTemplateColumns: `100px repeat(${classrooms.length},300px)` }}>
          <TimeColumn slots={timeSlotsTitle}></TimeColumn>
          {hideEmpty ? listaClassroomHidden : listaClassroom}
          <Outlet />
        </div>
      </div>
      <div className="virtual_courses_container" style={{ display: showVirtual ? "block" : "none" }}>
        <div className="virtualCoursesContainer">
          {
            showVirtual ? <VirtualCourses matriculas={data.cursosVirtuales} horarioId={data.idHorario} showVirtual={showVirtual} /> : null
          }
        </div>
      </div>
    </div>
  </>
}

export const action = HorarioAction;
export const loader = HorarioLoader;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: horarioStyles },

];