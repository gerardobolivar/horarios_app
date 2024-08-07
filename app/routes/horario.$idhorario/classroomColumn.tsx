import { Matricula } from "~/types/horarioTypes";
import CourseCell from "./courseCell";
import TIMESLOTS_REVERSE from "./reversedTimes";

type Props = {
  matriculas: Matricula[],
  nombreAula: string,
  timeSlots: string[],
  index: number
}

const ClassroomColumn: React.FC<Props> = ({ matriculas, nombreAula, timeSlots, index }) => {
  let previous: string = "";
  return <div key={nombreAula + index} className="classroom-column">
    <h3 >{nombreAula}</h3>
    {
      timeSlots.map((slot) => {
        const matricula = matriculas.find(m => m.hora_inicio <= TIMESLOTS_REVERSE[slot] && m.hora_final > TIMESLOTS_REVERSE[slot]);
        if (matricula && hoursTakenByCourse(matricula) > 1) {//When a course takes more than one hour the cells should be merged
          if (previous === "") {
            previous = String(matricula.curso.id_curso);
            return matricula ? <div key={slot} className="merged-cell" style={{ height: `${hoursTakenByCourse(matricula) * 50}px` }}><CourseCell classN="time-slot" key={slot} curso={matricula.curso}></CourseCell></div> : <div key={slot} className="empty-slot"></div>
          } else if (previous === String(matricula.curso.id_curso)) {
            return matricula ? <CourseCell classN={""} key={slot} curso={matricula.curso}></CourseCell> : <div key={slot} className="empty-slot"></div>
          }
        } else {
          return matricula ? <CourseCell classN={""} key={slot} curso={matricula.curso}></CourseCell> : <div key={slot} className="empty-slot"></div>
        }
      })
    }
  </div>
}

function hoursTakenByCourse(matricula: Matricula) {
  return matricula.hora_final - matricula.hora_inicio;
}

export default ClassroomColumn;