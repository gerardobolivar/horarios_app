import { Matricula } from "~/types/horarioTypes"
import { TIMES } from "./reversedTimes"

interface Props {
  matriculas: Matricula[]
}

const VirtualCourses: React.FC<Props> = ({ matriculas }) => {
  const listaCursos = matriculas.map((m) => {
    return <tr key={m.hora_inicio}>
      <td>{m.dia}</td>
      <td>{m.curso.nombre}</td>
      <td>{TIMES[Number(m.hora_inicio)]}</td>
      <td>{TIMES[Number(m.hora_final) - 1]}</td>
      <td>{m.modalidad}</td>
      <td>
        <button>🖉</button>
      </td>
      <td>
        <button>🗑</button>
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
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {listaCursos}
      </tbody>
    </table>
  </>
}

export default VirtualCourses;