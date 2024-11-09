import { LinksFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getTimeStamp } from "../horario.$idhorario.$idmatricula/utils";//Common import with matricula
import configPageStyles from "./cicleStyles.css?url";
import actionCycleIdcycle from "~/.server/Controller/cycle.$idcycle/action";
import { loaderCycleIdcycle } from "~/.server/Controller/cycle.$idcycle/loader";
import appStyles from '~/stylesheets/plan_.new.css?url';


export default function Cicle() {
  const data = useLoaderData<typeof loader>();
  const ciclo = data.ciclo;
  const horario = data.horario?.horario;
  const listaHorarios = data.listaHorarios?.map((h) => {
    return <option key={h.horario_id} value={h.horario_id}>{`${h.horario_id}`}</option>
  })
  const isActiveCycle = data.activeCycle?.ciclo_id === ciclo.ciclo_id;

  return <>
    <div id="main-doc" className="container">
      <h2>{ciclo.nombre}</h2>
      <div className="card">
        <div className="card-body">
          <header>Información General</header>
          <article>
            <p>Nombre: {ciclo.nombre}</p>
            <p>Creado: {getTimeStamp(ciclo.fecha_creado)}</p>
            <p>Modificado el: {getTimeStamp(ciclo.fecha_modificado)}</p>
            <p >Estado: {isActiveCycle ? "Activo" : "Inactivo"} <i className="bi bi-info-circle tooltip_">
              <span className="tooltiptext no-select">{isActiveCycle
                ? "El ciclo es el vigente y se ecuentra activo." :
                "El ciclo no es el vigente y se encuentra inactivo"}</span>
            </i></p>
          </article>
        </div>
      </div>

      <Form method="POST">
        <div className="card">
          <div className="card-body">
            <header>Configuración</header>
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">Horario vinculado</span>
              <select
                className="form-select"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                name="horario_vinculado"
                id="horario_vinculadoID"
                defaultValue={horario ? horario.horario_id : ""}>
                <option value="">Ninguno</option>
                {listaHorarios}
              </select>
            </div>
            <div className="d-flex">
              <label>Crear y asignar un horario nuevo:</label>
              <button
                name="intent"
                value="create_new_schedule"
                disabled={horario ? true : false}
                className="btn btn-primary mainButton">Crear
              </button>
            </div>
            <div className="d-flex">
              <label htmlFor="setAsCurrentCycle">Establecer como ciclo vigente:</label>
              <input
                type="checkbox"
                defaultChecked={isActiveCycle}
                name="setAsCurrentCycle"
                className="form-check-input"
              />
            </div>
          </div>
        </div>
        <button
          id="submitBtn"
          type="submit"
          name="intent"
          value="save_cicle_config"
          className="btn mainButton">Cuardar</button>

      </Form>

    </div>
  </>

}

export const action = actionCycleIdcycle;
export const loader = loaderCycleIdcycle;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: configPageStyles },
  { rel: "stylesheet", href: appStyles },
];