import { LinksFunction} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import scheduleConfigPageStyles from './scheduleConfigPageStyles.css?url';
import appStyles from '~/stylesheets/plan_.new.css?url';
import { getTimeStamp } from "../horario.$idhorario.$idmatricula/utils";
import loaderHorarioIdhorarioConfig from "~/.server/Controller/horario_.$idhorario.config/loader";
import actionHorarioIdhorarioConfig from "~/.server/Controller/horario_.$idhorario.config/action";


export default function HorarioConfigPage() {
  const data = useLoaderData<typeof loader>();
  const horarioId = data.horarioId;
  const horario: any = data.horario;
  const ciclo = data.ciclo
  const isBinded = data.ciclo ? true : false;

  return <>
    <div id="pageContainer">

      <main id="main-doc">
        <section
          className="main-section"
          id="General">
          <header>Información General</header>
          <article>
            <p>Creado el: {getTimeStamp(horario.fecha_creado)}</p>
            <p>Modificado el: {getTimeStamp(horario.fecha_modificado)}</p>
            <p>Ciclo vinculado: {isBinded ? ciclo?.nombre : "No existe."}</p>
          </article>
        </section>
        <section
          className="main-section"
          id="Archivar">
          <header>Archivar</header>
          <article>
            <p>Al archivar el horario el ciclo pasará a inactivo y el horario dejará de ser accesible para los usuarios.</p>
            <p>Estado: <b>{`${horario.active ? "Activo": "Archivado"}`}</b></p>
            <Form method="POST">
              <button value={horario.active ? "archivar" : "desarchivar"} name="intent" >{horario.active ? "Archivar" : "Desarchivar"}</button>
            </Form>
          </article>
        </section>
        <section
          className="main-section"
          id="Estado">
          <header>Cambios</header>
          <article>
            <p>Estado: {horario.active ? "Abierto" : "Cerrado"}</p>
            <p><i>Abierto: Se aceptan cambios al horario.</i></p>
            <p><i>Cerrado: No se aceptan cambios al horario.</i></p>
          </article>
        </section>
        <section
          className="main-section"
          id="Visibilidad">
          <header>Visibilidad</header>
          <article>
            <p>Todos: Cualquier usuario puede ver el horario.</p>
            <p>Usuarios del sistema: Solo los usuarios del sistema pueden ver el horario.</p>
            <p>ADMIN: Solo los usuarios administradores pueden ver el horario.</p>
            <i>No disponible de momento.</i>
          </article>
        </section>
      </main>
    </div>
  </>
}

export const action = actionHorarioIdhorarioConfig;
export const loader = loaderHorarioIdhorarioConfig;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: scheduleConfigPageStyles },
  { rel: "stylesheet", href: appStyles },
];
