import { Matricula } from "~/types/horarioTypes"
import { DIAS, TIMES } from "./reversedTimes"
import { Link } from "@remix-run/react"

interface Props {
  matriculas: Matricula[],
  horarioId: number,
  showVirtual: boolean,
  search:string
}

const VirtualCourses: React.FC<Props> = ({ matriculas, horarioId, showVirtual, search }) => {
  const listaCursos = matriculas.map(m=>{
    let formatedTimeLine:string = "";
    m.time_spans.map((t,i)=>{
      formatedTimeLine += `${i == 0 ? "":", "}${DIAS[t.dia]}: ${TIMES[Number(t.hora_inicio)]?.split("-")[0]}-${t.hora_final === 23 ? "23:00":TIMES[Number(t.hora_final)]?.split("-")[0]}${i+1 === m.time_spans.length?".":""}`
    })
    return <tr key={String(m.matricula_id)+formatedTimeLine}>
      <td>{m.group?.curso.nombre}</td>
      <td>{Number(m.group?.groupNumber) < 10 ? `0${m.group?.groupNumber}`:m.group?.groupNumber}</td>
      <td>{formatedTimeLine}</td>
      <td>
        <Link to={{
          pathname: `/horario/${horarioId}/${m.matricula_id}/`,
          search: search
        }}
        state={{showVirtual: showVirtual}}>
          <button>🖉</button>
        </Link>
      </td>
    </tr>
  })

  return <>
  <h3 className="mainTitle mainTitleVirtualCourses" >Cursos Virtuales</h3>
    <table>
      <thead>
        <tr>
          <th>Curso</th>
          <th>Grupo</th>
          <th>Horario</th>
          <th>Actualizar</th>
        </tr>
      </thead>
      <tbody>
        {listaCursos}
      </tbody>
    </table>
  </>
}

export default VirtualCourses;