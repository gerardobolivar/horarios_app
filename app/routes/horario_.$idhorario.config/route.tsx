import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import scheduleConfigPageStyles from './scheduleConfigPageStyles.css?url';
import appStyles from '~/stylesheets/plan_.new.css?url';
import { getBindedHorario, unBindCicloByHorario, updateUpdateDate } from "prisma/models/cicloModel";
import { activateHorarioById, deactivateHorarioById, getHorario } from "prisma/models/horarioModel";
import { getTimeStamp } from "../horario.$idhorario.$idmatricula/utils";


export default function HorarioConfigPage() {
  const data = useLoaderData<typeof loader>();
  const horarioId = data.horarioId;
  const horario: any = data.horario;
  const ciclo = data.ciclo
  const isBinded = data.ciclo ? true : false;

  return <>
    <div id="pageContainer">
      <nav id="navbar">
        <header>
          <h1>Configuración de Horario</h1>
        </header>
        <ul>
          <li><a href="#General"
            className="nav-link">
            Información general
          </a></li>
          <li><a href="#Archivar"
            className="nav-link">
            Archivar
          </a></li>
          <li><a href="#Estado"
            className="nav-link">
            Estado
          </a></li>
          <li><a href="#Visibilidad"
            className="nav-link">
            Visibilidad
          </a></li>
        </ul>
      </nav>
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
            <p>Al archivar el horario este se desvinculará del ciclo respectivo y el estado pasará a cerrado.</p>
            <Form method="POST">
              <button value="archivar" name="intent" disabled={!isBinded}>{isBinded ? "Archivar" : "Archivado"}</button>
            </Form>
          </article>
        </section>
        <section
          className="main-section"
          id="Estado">
          <header>Estado</header>
          <article>
            <p>Estado: {horario.active ? "Abierto" : "Cerrardo"}</p>
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

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const horarioId = Number(params.idhorario)

  if (intent === "archivar") {
    return await unBindCicloByHorario(horarioId).then( async () => {
      await deactivateHorarioById(horarioId);
      return redirect(`/horario/${horarioId}/config`)
    }).catch((e) => { return redirect(`/error`) })
  } else {
    return null;
  }
}

export const loader = async ({ params, }: LoaderFunctionArgs) => {
  const horarioId = Number(params.idhorario);
  const horario = await getHorario(horarioId).then((r) => { return r }, () => { return {} }).catch((e) => { console.error(e); return {} })
  const ciclo = await getBindedHorario(horarioId).then(
    (r) => r).catch((e) => {
      console.error(e)
      return null;
    })
  return json({ horarioId: horarioId, horario: horario, ciclo: ciclo })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: scheduleConfigPageStyles },
  { rel: "stylesheet", href: appStyles },
];
