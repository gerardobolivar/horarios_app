import { Matricula } from "~/types/horarioTypes"
import { SHORTEN_DAYS, SHORTEN_TIMES, TIMES } from "./reversedTimes"
import { Link } from "@remix-run/react"

interface Props {
  matriculas: Matricula[]|null,
  horarioId: number,
  showVirtual: boolean,
  search:string,
  isAdmin:boolean
}

const VirtualCourses: React.FC<Props> = ({ matriculas, horarioId, showVirtual, search, isAdmin}) => {
  const listaCursos = matriculas ? matriculas.map(m=>{
    let formatedTimeLine:string = "";
    m.time_spans.map((t,i)=>{
      formatedTimeLine += `${i == 0 ? "":", "}${SHORTEN_DAYS[t.dia]} ${SHORTEN_TIMES[Number(t.hora_inicio)]} a ${t.hora_final === 23 ? "23:00":TIMES[Number(t.hora_final)]?.split("-")[0]}${i+1 === m.time_spans.length?".":""}`
    })
    return <tr key={String(m.matricula_id)+formatedTimeLine}>
      <td>{`${m.group?.curso.sigla} ${m.group?.curso.nombre}-G${Number(m.group?.groupNumber) < 10 ? `0${m.group?.groupNumber}`:m.group?.groupNumber}`}</td>
      <td>{formatedTimeLine}</td>
      <td>
        <Link to={{
          pathname: `/horario/${horarioId}/${m.matricula_id}/`,
          search: search
        }}
        state={{showVirtual: showVirtual}}>
          <button className="mainButton iconButton">
          <i className="bi bi-pencil-fill"></i>
          </button>
        </Link>
      </td>
    </tr>
  }) : null

  return <>
  <h3 className="mainTitle mainTitleVirtualCourses" >{isAdmin ? "Cursos Virtuales":"Mis cursos virtuales"}</h3>
  {
    listaCursos && listaCursos.length >= 1 ? <table>
    <thead>
      <tr>
        <th>Curso</th>
        <th>Horario</th>
        <th>Actualizar</th>
      </tr>
    </thead>
    <tbody>
      {listaCursos}
    </tbody>
  </table>: <h6>Sin cursos virtuales.</h6> 
  }

  </>
}

export default VirtualCourses;