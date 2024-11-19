import CourseCell from "./courseCell";
import { Link } from "@remix-run/react";
import { TIMESLOTS_REVERSE } from "./reversedTimes";
import { useOptionalUser } from "~/utils";


type Props = {
  scheduleTimeSpans: any,
  nombreAula: number,
  timeSlots: string[],
  horarioId: number,
  aula_id: number,
  index: number,
  search: string,
  isActive: boolean
}

const ClassroomColumn: React.FC<Props> = ({ scheduleTimeSpans, nombreAula, timeSlots, index, horarioId, aula_id,search, isActive }) => {
  let isCellMerged: boolean = false;
  let cont: number = 1;
  const user = useOptionalUser();
  const isAdmin = user?.role === "ADMIN";
  
  return <div key={nombreAula + index} className="classroom-column">
    <h3 className="aulaTitle">{`${nombreAula < 10 ? "Aula 0" + nombreAula:  nombreAula === 999 ? "Virtual" : "Aula "+nombreAula}`}</h3>
    {
      timeSlots.map((slot) => {
        const matricula = scheduleTimeSpans.find((m:any) => m.hora_inicio <= TIMESLOTS_REVERSE[slot] && m.hora_final > TIMESLOTS_REVERSE[slot]);
        const numberToMerge = matricula ? hoursTakenByCourse(matricula) : 1;
        
        if (matricula && numberToMerge > 1) {
          if (!isCellMerged && cont < numberToMerge) {
            isCellMerged = true;
            return matricula ?
              <div 
                key={slot + nombreAula}
                className="merged-cell"
                style={{ height: `${hoursTakenByCourse(matricula) * 50}px`}}>
                <CourseCell
                  horarioId={horarioId}
                  matriculaId={matricula.matricula.matricula_id}
                  classN="time-slot" curso={matricula.matricula.group.curso}
                  hiddenCell={false}
                  aulaID={aula_id}
                  color={matricula.matricula.color}
                  matricula={matricula}
                  search={search}>
                </CourseCell></div>:
              <div key={slot + nombreAula} className="empty-slot"></div>
          }
          else {
            cont++
            if (cont === numberToMerge) { isCellMerged = false; cont = 1; }
            return matricula ? 
            <CourseCell 
              horarioId={horarioId}
              matriculaId={matricula.matricula.matricula_id}
              classN={""}
              key={slot + nombreAula}
              curso={matricula.matricula.group.curso}
              hiddenCell={true} aulaID={aula_id}
              color={matricula.matricula.color}
              matricula={matricula}
              search={search}></CourseCell>:
            <div key={slot + nombreAula} className="empty-slot"></div>
          }
        }
        else {
          isCellMerged = false;
          cont = 1;
          return matricula ?
          <CourseCell
            horarioId={horarioId}
            matriculaId={matricula.matricula.matricula_id}
            hiddenCell={false}
            classN={"single-slot"}
            key={slot}
            curso={matricula.matricula.group.curso}
            aulaID={aula_id}
            color={matricula.matricula.color}
            matricula={matricula}
            search={search}>
          </CourseCell> :
            !isActive && isAdmin ?
            <Link
              key={slot+aula_id}
              state={{ timePicked: TIMESLOTS_REVERSE[slot],aulaID: aula_id}}
              to={{
                pathname:`/horario/${horarioId}/new`,
                search: search+`&aula=${aula_id}`
              }}>
                <div className="single-slot empty-slot"></div>
            </Link>
            : 
              <div key={slot+aula_id}>
                <div className="single-slot empty-slot"></div>
              </div>
        }
      })

    }
  </div>
}

function hoursTakenByCourse(matricula: any) {
  return matricula.hora_final - matricula.hora_inicio;
}

export default ClassroomColumn;