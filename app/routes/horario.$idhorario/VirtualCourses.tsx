import { Matricula } from "~/types/horarioTypes"
import { TIMES } from "./reversedTimes"
import { Link } from "@remix-run/react"

interface Props {
  matriculas: Matricula[],
  horarioId: number,
  showVirtual: boolean
}

const VirtualCourses: React.FC<Props> = ({ matriculas, horarioId, showVirtual }) => {
  const listaCursos = matriculas.map((m) => {
    return <tr key={m.hora_inicio+m.dia}>
      <td>{m.dia}</td>
      <td>{m.curso.nombre}</td>
      <td>{TIMES[Number(m.hora_inicio)]}</td>
      <td>{TIMES[Number(m.hora_final) - 1]}</td>
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
          <th>Dia</th>
          <th>Curso</th>
          <th>Inicio</th>
          <th>Fin</th>
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