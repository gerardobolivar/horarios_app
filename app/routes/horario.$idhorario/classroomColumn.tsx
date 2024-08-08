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

  let isCellMerged: boolean = false;
  let cont: number = 1;

  return <div key={nombreAula + index} className="classroom-column">
    <h3 >{nombreAula}</h3>
    {
      timeSlots.map((slot) => {
        const matricula = matriculas.find(m => m.hora_inicio <= TIMESLOTS_REVERSE[slot] && m.hora_final > TIMESLOTS_REVERSE[slot]);
        const numberToMerge = matricula ? hoursTakenByCourse(matricula) : 1;

        if (matricula && numberToMerge > 1) {
          if (!isCellMerged && cont < numberToMerge) {
            isCellMerged = true;
            return matricula ?
              <div key={slot} className="merged-cell" style={{ height: `${hoursTakenByCourse(matricula) * 50}px` }}>
                <CourseCell classN="time-slot" key={slot} curso={matricula.curso} hiddenCell={false}></CourseCell></div> :
              <div key={slot} className="empty-slot"></div>
          }
          else {
            cont++
            if (cont === numberToMerge) { isCellMerged = false; cont = 1; }
            return matricula ? <CourseCell classN={""} key={slot} curso={matricula.curso} hiddenCell={true}></CourseCell> : <div key={slot} className="empty-slot"></div>
          }
        }
        else {
          isCellMerged = false;
          cont = 1;
          return matricula ? <CourseCell hiddenCell={false} classN={""} key={slot} curso={matricula.curso}></CourseCell> : <div key={slot} className="empty-slot"></div>
        }
      })

    }
  </div>
}

function hoursTakenByCourse(matricula: Matricula) {
  return matricula.hora_final - matricula.hora_inicio;
}

export default ClassroomColumn;