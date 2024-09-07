import { Matricula } from "~/types/horarioTypes"
import { TIMES } from "./reversedTimes"
import { Link } from "@remix-run/react"

interface Props {
  matriculas: Matricula[],
  horarioId: number,
  showVirtual: boolean
}

const VirtualCourses: React.FC<Props> = ({ matriculas, horarioId, showVirtual }) => {
  const listaCursos = matriculas.map(m=>{
    let formatedTimeLine:string = "";
    formatedTimeLine += m.time_spans.map((t,i)=>{
      if(i === m.time_spans.length){
        return `${t.dia}: ${TIMES[Number(t.hora_inicio)]}/${TIMES[Number(t.hora_final)]}`
      }else{
        return `${t.dia}: ${TIMES[Number(t.hora_inicio)]}/${TIMES[Number(t.hora_final)]}`
      }
    })
    return <tr key={String(m.matricula_id)+formatedTimeLine}>
      <td>{m.group?.curso.nombre}</td>
      <td>{m.group?.group_id}</td>
      <td>{formatedTimeLine}</td>
      <td>{m.modalidad}</td>
      <td>
        <Link to={`/horario/${horarioId}/${m.matricula_id}/`}
        state={{showVirtual: showVirtual}}>
          <button>🖉</button>
        </Link>
      </td>
    </tr>
  })

  return <>
    <table>
      <thead>
        <tr>
          <th>Curso</th>
          <th>Grupo</th>
          <th>Horario</th>
          <th>Modalidad</th>
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