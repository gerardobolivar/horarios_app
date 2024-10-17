import { Link} from "@remix-run/react";
import { Curso } from "~/types/horarioTypes"

let myEvent: any;
function handleDoubleClick(event: any) {
  //myEvent.submit();

}

function handleClick(event: any) {
  myEvent = event;
  event.preventDefault();
}



type Props = {
  curso: Curso,
  classN: string,
  hiddenCell: boolean,
  matriculaId: number,
  horarioId: number,
  aulaID: number,
  color: string,
  matricula: any,
  search: string
}

const CourseCell: React.FC<Props> = ({ curso, classN, hiddenCell, matriculaId, horarioId, aulaID, color, matricula, search }) => {
  const style = { textDecoration: "none" };
  const styleCell = { backgroundColor: `#${color}` };
  const groupNumber = matricula.matricula.group.groupNumber
  const groupNumberFormatted = `G${(Number(groupNumber) < 10 ? `0${(groupNumber)}` : groupNumber)}`;
  const formattedTeacherName = `${matricula.matricula.group.profesor.nombre} ${matricula.matricula.group.profesor.primer_apellido} ${matricula.matricula.group.profesor.segundo_apellido}`
  const hoursType = matricula.type === null ? "?" : matricula.type
   
  return <Link
    style={style}
    to={
      {
        pathname: `/horario/${horarioId}/${matriculaId}`,
        search: search
      }
    }
    state={{ aulaID: aulaID }}>
    <div
      style={styleCell}
      className={`${classN} course-cell`}
      onDoubleClick={handleDoubleClick}>
      <span>
        <p>
          {hiddenCell ? null : `${curso.nombre} - ${groupNumberFormatted} - ${formattedTeacherName} - ${hoursType}`}
        </p>
      </span>
    </div>
  </Link>
}

export default CourseCell;