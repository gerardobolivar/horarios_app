import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import scheduleConfigPageStyles from './scheduleConfigPageStyles.css?url';
import appStyles from '~/stylesheets/plan_.new.css?url';


export default function HorarioConfigPage() {
  const data = useLoaderData<typeof loader>();
  const horarioId = data.horarioId;

  return <>
    <div id="pageContainer">
      <nav id="navbar">
        <header>
          <h1>Configuración de Horario</h1>
        </header>
        <ul>
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
          id="Archivar">
          <header>Archivar</header>
          <article>
            <p>Al archivar el horario este se desvinculará del ciclo respectivo.</p>
          </article>
        </section>
        <section
          className="main-section"
          id="Estado">
          <header>Estado</header>
          <article>
            <p>Abierto: Se aceptan cambios al horario. Cerrado: No se aceptan cambios al horario.</p>
            <i>No disponible de momento.</i>
          </article>
        </section>
        <section
          className="main-section"
          id="Visibilidad">
          <header>Visibilidad</header>
          <article>
          <p>Todos: Cualquier usuario puede ver el horario. Usuarios del sistema: Solo los usuarios del sistema pueden ver el horario. ADMIN: Solo los usuarios administradores pueden ver el horario.</p>
          <i>No disponible de momento.</i>
          </article>
        </section>
      </main>
    </div>
  </>
}

export async function action({ request, params }: ActionFunctionArgs) {
  return null;
}

export const loader = async ({ params, }: LoaderFunctionArgs) => {
  const horarioId = params.idhorario;
  return json({ horarioId: horarioId })
}


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: scheduleConfigPageStyles },
  { rel: "stylesheet", href: appStyles },
];
