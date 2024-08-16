import { Matricula } from "~/types/horarioTypes";
import CourseCell from "./courseCell";
import { Link, useLocation, useSearchParams } from "@remix-run/react";
import { TIMESLOTS_REVERSE } from "./reversedTimes";

type Props = {
  matriculas: Matricula[],
  nombreAula: number,
  timeSlots: string[],
  horarioId: number,
  aula_id: number,
  index: number
}

const ClassroomColumn: React.FC<Props> = ({ matriculas, nombreAula, timeSlots, index, horarioId, aula_id }) => {
  let isCellMerged: boolean = false;
  let cont: number = 1;

  return <div key={nombreAula + index} className="classroom-column">
    <h3 >{`${nombreAula < 10 ? "Aula 0" + nombreAula:  nombreAula === 999 ? "Virtual" : "Aula "+nombreAula}`}</h3>
    {
      timeSlots.map((slot) => {
        const matricula = matriculas.find(m => m.hora_inicio <= TIMESLOTS_REVERSE[slot] && m.hora_final > TIMESLOTS_REVERSE[slot]);
        const numberToMerge = matricula ? hoursTakenByCourse(matricula) : 1;

        if (matricula && numberToMerge > 1) {
          if (!isCellMerged && cont < numberToMerge) {
            isCellMerged = true;
            return matricula ?
              <div 
                key={slot + nombreAula}
                className="merged-cell"
                style={{ height: `${hoursTakenByCourse(matricula) * 50}px` }}>
                <CourseCell
                  horarioId={horarioId}
                  matriculaId={matricula.matricula_id}
                  classN="time-slot" curso={matricula.curso}
                  hiddenCell={false}>
                </CourseCell></div>:
              <div key={slot + nombreAula} className="empty-slot"></div>
          }
          else {
            cont++
            if (cont === numberToMerge) { isCellMerged = false; cont = 1; }
            return matricula ? 
            <CourseCell 
              horarioId={horarioId}
              matriculaId={matricula.matricula_id}
              classN={""}
              key={slot + nombreAula}
              curso={matricula.curso}
              hiddenCell={true}></CourseCell>:
            <div key={slot + nombreAula} className="empty-slot"></div>
          }
        }
        else {
          isCellMerged = false;
          cont = 1;
          return matricula ?
          <CourseCell
            horarioId={horarioId}
            matriculaId={matricula.matricula_id}
            hiddenCell={false}
            classN={"single-slot"}
            key={slot}
            curso={matricula.curso}>
          </CourseCell> :
            <Link
              key={crypto.randomUUID()}
              state={{ timePicked: TIMESLOTS_REVERSE[slot],aula_id: aula_id}}
              to={`/horario/${horarioId}/new`}>
                <div className="single-slot empty-slot"></div>
            </Link>
        }
      })

    }
  </div>
}

function hoursTakenByCourse(matricula: Matricula) {
  return matricula.hora_final - matricula.hora_inicio;
}

export default ClassroomColumn;