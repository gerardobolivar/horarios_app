import { ActionFunctionArgs, LinksFunction, redirect } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import appStyles from '../stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";


export default function PlanNew() {
  const DEFAULT_TOOLTIP_PLAN = "Nombre del plan de estudios"
  const data = useLoaderData<typeof loader>();
  const [listaCursos, setListaCursos] = useState(data);
  const [nombrePlan, setNombrePlan] = useState(DEFAULT_TOOLTIP_PLAN);
  //const [codigoPlan, setCondigoPlan] = useState("");

  let cursos = Object.values(listaCursos.cursos).map(curso => {
    return <li key={crypto.randomUUID()}>{curso}</li>
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.currentTarget.value !== ""
      ? setNombrePlan(event.currentTarget.value)
      : setNombrePlan(DEFAULT_TOOLTIP_PLAN)
  }

  const [importedScript, setImportedScript] = useState<any>();

  useEffect(() => {
    const importedScript = async () => {
      const module = await import("~/Scripts/FrontEnd/newPlan.js");
      const script = module.default;
      setImportedScript(script);
    };

    importedScript();
  }, []);

  return (
    <div className="container">
      <Form method="post" autoComplete="off">
        <span className="d-block">
          <input
            id="planTitle"
            title={nombrePlan}
            type="text"
            name="nombre"
            placeholder="Nombre del plan✎"
            className="inputTitle mainTitle"
            onChange={handleChange} />
        </span>
        <div className="whiteContainer">
          <div>
            <label>
              Código:
              <input type="text" name="codigo" placeholder="Código✎" />
            </label>
          </div>
          <div className="listaCursos inputElement">
            <label>Cursos asociados:</label>
            <ul className="whiteContainer">
              {cursos}
            </ul>
            <span className="horarios-plan-new-listacursos-buttons">
              <button type="button">Agregar</button>
              <button type="button">Eliminar</button>
              <button type="button">Ver</button>
            </span>
          </div>

        </div>
        <button type="submit">Crear</button>
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  //Validar datos codigo, nombre
  const formData = await request.formData();
  const name = String(formData.get("name"));
  return redirect("/plan")
}

export function loader() {
  //Cargar cursos asociados al plan desde el backend
  const cursos = {
    0: "IF5584 Introducción a Sistema de Información",
    1: "IF5583 Introducción a Sistema de Información",
    2: "IF5585 Introducción a Sistema de Información",
    3: "IF5587 Introducción a Sistema de Información",
    4: "IF2342 Fundamentos de Bases de Datos"
  }

  return json({ cursos: cursos })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
];
