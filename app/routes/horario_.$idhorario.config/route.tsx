import { LinksFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import { getTimeStamp } from "../horario.$idhorario.$idmatricula/utils";
import loaderHorarioIdhorarioConfig from "~/.server/Controller/horario_.$idhorario.config/loader";
import actionHorarioIdhorarioConfig from "~/.server/Controller/horario_.$idhorario.config/action";
import configPageStyles from "~/routes/cicle.$idcicle/cicleStyles.css?url";
import ReactTimeAgo from 'react-time-ago';

export default function HorarioConfigPage() {
  const data = useLoaderData<typeof loader>();
  const horarioId = data.horarioId;
  const horario:any = data.horario;
  const ciclo = data.ciclo
  const isBinded = data.ciclo ? true : false;
  const hasCloseTime = data.closeHorario;
  const datetime = new Date(hasCloseTime?.datetime as string);
  const isPast = new Date() > datetime;
  const currentDate = new Date();
  const visibility = horario?.visible;

  return <>
    <div className="container main-doc schConfiCard">

      <div>

        <div className="card">
          <div className="card-body">
            <div>
              <header>Información General</header>
              <article>
                <p>Creado: {getTimeStamp(horario.fecha_creado)}</p>
                <p>Ciclo vinculado: {isBinded ? ciclo?.nombre : "No existe."}</p>
              </article>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <Form method="POST">
              <header>Estado</header>
              <div>
                <article>
                  <p>Al cerrar el horario ningún usuario podrá relizar cambios.</p>
                  <p >Estado: <b className={horario.active ? "text-success" : "text-danger"}>{`${horario.active ? "Activo" : "Inactivo"}`}</b></p>
                  <button
                    id="submitBtn"
                    value={horario.active ? "archivar" : "desarchivar"}
                    name="intent"
                    className="btn mainButton submitBtn">{horario.active ? "Cerrar" : "Abrir"}</button>
                </article>
                <hr></hr>
                {
                  !hasCloseTime ? <div>
                    <h6>Programar cierre</h6>
                    <label htmlFor="close_sch">Ingrese la fecha y hora en que desea programar el cierre del horario:</label>
                    <input
                      id="close_sch"
                      type="datetime-local"
                      name="close_sch"
                      min={currentDate.toISOString()}
                      className="form-control datetimeInput" />
                    <button
                      id="scheduleBtn"
                      value={"schedule"}
                      name="intent"
                      disabled={!horario.active}
                      className="btn mainButton submitBtn">Guardar</button>
                  </div> :
                    <div>
                      <p>{`${isPast ? "El horario cerró " : "El horario cerrará "}`}<ReactTimeAgo date={datetime} />.</p>
                      {hasCloseTime && !isPast ? <button
                        id="scheduleBtn"
                        value={"schedule_cancel"}
                        name="intent"
                        className="btn mainButton submitBtn">Cancelar</button> : null}
                    </div>
                }

              </div>
            </Form>

          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <Form method="POST">
              <header>Visibilidad</header>
              <div>
                <p>Este horario puede ser visto por:</p>
                <select
                  className="form-select"
                  name="visibility_select"
                  id="visibility_select"
                  defaultValue={visibility}>
                  <option value="a">Público</option>
                  <option value="u">Usuarios del sistema</option>
                  <option value="s">Administradores</option>
                </select>
                <button
                      id="visibilityBtn"
                      value={"visibility"}
                      name="intent"
                      disabled={!horario.active}
                      className="btn mainButton submitBtn visibilityBtn">Guardar</button>

              </div>
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
