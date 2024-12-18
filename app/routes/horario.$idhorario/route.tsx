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
import { useEffect, useState } from "react";

export default function () {
  const data = useLoaderData<typeof loader>();
  const timeSlotsTitle: string[] = data.timesTitle
  const timeSlots: string[] = Object.values(data.timeSlots);
  const classrooms = Object.values(data.aulas).map(a => a.identificador);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showVirtual, setShowVirtual] = useState(false);
  const [hideEmpty, setHideEmpty] = useState(false); 
  const scheduleTimeSpans = data.scheduleTimeSpans;
  const user = useOptionalUser();
  const isGuest = user?.role === "GUEST";
  const isAdmin = user?.role === "ADMIN";
  const should_deactivate = !isAdmin && !data.isActive;
  
  
  const defaultParams = {
    dia: "LUNES"
  }

  function handleDrag(e: React.DragEvent) {
    // const scheduleUI = e.currentTarget;
    // (e.target as HTMLAnchorElement).textContent;
    // console.log(e)
  }

  useEffect(()=>{
    setSearchParams(defaultParams);
  },[])

  useEffect(()=>{
    const scheduleLayout = document.getElementById("scheduleLayout") as HTMLDivElement;
    if(showVirtual){
      scheduleLayout.classList.remove("grid_container");
      scheduleLayout.classList.add("grid_container_dual");
    }else{
      scheduleLayout.classList.remove("grid_container_dual");
      scheduleLayout.classList.add("grid_container");
    }
  },[showVirtual])

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
      search={searchParams.toString()}
      isActive={Boolean(data.isActive)}></ClassroomColumn>: null
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
      search={searchParams.toString()}
      isActive={Boolean(data.isActive)}></ClassroomColumn> : null
  })

  function handleCloseAlert(){
    const alert = document.getElementById("state_alert") as HTMLDivElement;
    alert.classList.add("vanish");
  }

  return <>
    <div
      style={data.isActive || isGuest? {display:"none"}:{}}
      className="alert alert-warning alert-dismissible fade show"
      id="state_alert"
      role="alert">
    {isAdmin ? <p><strong>Horario deshabilitado.</strong> Los usuarios no pueden realizar cambios.</p>:
      <p><strong>Horario deshabilitado.</strong> No se aceptan cambios.</p>}
      <button
        type="button"
        className="btn"
        data-dismiss="alert ms-auto"
        aria-label="Close"
        onClick={handleCloseAlert}>
        <span aria-hidden="true">&times;</span>
      </button>

    </div>
    <div className="grid_container_filter_config">
      <div className="filtersHorario">
        <Filters
          data={data}
          horarioId={data.idHorario}
          planes={data.planes}
          setShowVirtual={setShowVirtual}
          setHideEmpty={setHideEmpty}
          isGuest={isGuest}></Filters>
      </div>
    </div>
    <div className="regis-btn-sch">
      <Link replace={true} hidden={isGuest} className="lnk-btn" to={{
        pathname:`/horario/${data.idHorario}/new`,
        search: searchParams.toString()
      }}>
        <button disabled={should_deactivate} className={should_deactivate ? "mainButton disabled": "mainButton"}>Registrar</button>
      </Link>
      <Link replace={true} hidden={user?.role !== "ADMIN"} className="lnk-btn" to={{
        pathname:`/horario/${data.idHorario}/config`,
        search: searchParams.toString()
      }}>
        <button className="mainButton iconButton">
        <i className="bi bi-gear-fill"></i>
        </button>
      </Link>   
    </div>
    <div className="grid_container" id="scheduleLayout">
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
      {
        showVirtual && !isGuest?
          <div className="virtual_courses_container">
            <div className="virtualCoursesContainer">
              <VirtualCourses
                matriculas={data.cursosVirtuales}
                horarioId={data.idHorario}
                showVirtual={showVirtual}
                search={searchParams.toString()}
                isAdmin={isAdmin}/>
            </div>
          </div>
        :null
      }
    </div>
  </>
}

export const action = HorarioAction;
export const loader = HorarioLoader;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: horarioStyles },

];