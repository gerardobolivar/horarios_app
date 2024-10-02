import { LinksFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getTimeStamp } from "../horario.$idhorario.$idmatricula/utils";//Common import with matricula
import configPageStyles from "./cicleStyles.css?url";
import actionCycleIdcycle from "~/.server/Controller/cycle.$idcycle/action";
import { loaderCycleIdcycle } from "~/.server/Controller/cycle.$idcycle/loader";

export default function Cicle() {
  const data = useLoaderData<typeof loader>();
  const ciclo = data.ciclo;
  const horario = data.horario?.horario;
  const listaHorarios = data.listaHorarios?.map((h) => {
    return <option key={h.horario_id} value={h.horario_id}>{`${h.horario_id}`}</option>
  })
  const isActiveCycle = data.activeCycle?.ciclo_id === ciclo.ciclo_id;

  return <>
    <main id="main-doc">
      <section
        className="main-section"
        id="General">
        <header>Información General</header>
        <article>
          <p>Nombre: {ciclo.nombre}</p>
          <p>Creado: {getTimeStamp(ciclo.fecha_creado)}</p>
          <p>Modificado: {getTimeStamp(ciclo.fecha_modificado)}</p>
          <p >Estado: {isActiveCycle ? "Activo" : "Inactivo"} <i className="bi bi-info-circle tooltip_">
            <span className="tooltiptext no-select">{isActiveCycle ? "El ciclo es el vigente y se ecuentra activo." : "El ciclo no es el vigente y se encuentra inactivo"}</span>
          </i></p>
        </article>
      </section>
      <section
        className="main-section"
        id="Archivar">
        <header>Configuración</header>
        <Form method="POST">
          <article>
            <label htmlFor="horario_vinculado">Horario vinculado:</label>
            <select
              name="horario_vinculado"
              id="horario_vinculadoID"
              defaultValue={horario ? horario.horario_id : ""}>
              <option value="">Ninguno</option>
              {listaHorarios}
            </select>
          </article>
          <article>
            <label>Crear asignar un horario nuevo:</label>
            <button
              name="intent"
              value="create_new_schedule"
              disabled={horario ? true : false}>Crear
            </button>
          </article>
          <article>
            <label htmlFor="setAsCurrentCycle">Establecer como ciclo vigente:</label>
            <input
              type="checkbox"
              defaultChecked={isActiveCycle}
              name="setAsCurrentCycle"
            />
          </article>
          <button
            type="submit"
            name="intent"
            value="save_cicle_config"
            className="mainButton">Cuardar cambios</button>
        </Form>
      </section>
    </main>
  </>

}

export const action = actionCycleIdcycle;
export const loader = loaderCycleIdcycle;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: configPageStyles },
];