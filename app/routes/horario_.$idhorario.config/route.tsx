import { LinksFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import scheduleConfigPageStyles from './scheduleConfigPageStyles.css?url';
import appStyles from '~/stylesheets/plan_.new.css?url';
import { getTimeStamp } from "../horario.$idhorario.$idmatricula/utils";
import loaderHorarioIdhorarioConfig from "~/.server/Controller/horario_.$idhorario.config/loader";
import actionHorarioIdhorarioConfig from "~/.server/Controller/horario_.$idhorario.config/action";
import configPageStyles from "~/routes/cicle.$idcicle/cicleStyles.css?url";



export default function HorarioConfigPage() {
  const data = useLoaderData<typeof loader>();
  const horarioId = data.horarioId;
  const horario: any = data.horario;
  const ciclo = data.ciclo
  const isBinded = data.ciclo ? true : false;

  return <>
    <div className="container main-doc schConfiCard">

      <div>

        <div className="card">
          <div className="card-body">
            <div>
              <header>Información General</header>
              <article>
                <p>Creado el: {getTimeStamp(horario.fecha_creado)}</p>
                <p>Modificado el: {getTimeStamp(horario.fecha_modificado)}</p>
                <p>Ciclo vinculado: {isBinded ? ciclo?.nombre : "No existe."}</p>
              </article>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <Form method="POST">
              <div>
                <header>Estado</header>
                <article>
                  <h6>Cierre manual</h6>
                  <p>Al cerrar el horario ningún usuario podrá relizar cambios al mismo.</p>
                  <p>Estado: <b>{`${horario.active ? "Activo" : "Inactivo"}`}</b></p>
                  <button
                    id="submitBtn"
                    value={horario.active ? "archivar" : "desarchivar"}
                    name="intent"
                    className="btn mainButton">{horario.active ? "Cerrar" : "Abrir"}</button>
                </article>
                <hr></hr>
                <h6>Programar cierre</h6>
                <p>Al cerrar el horario no se podrán relizar cambios al mismo.</p>
                <label htmlFor="close_sch">Ingrese la fecha y hora en que desea cerrar el horario:</label>
                <input
                  id="close_sch"
                  type="datetime-local"
                  name="close-schedule"
                  className="form-control" />
              </div>
              <button
                id="submitBtn"
                value={"programar"}
                name="intent"
                className="btn mainButton">Guardar</button>
            </Form>

          </div>
        </div>
      </div>
    </div>
  </>
}

export const action = actionHorarioIdhorarioConfig;
export const loader = loaderHorarioIdhorarioConfig;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: configPageStyles },
  { rel: "stylesheet", href: appStyles },
];
