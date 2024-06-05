import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import appStyles from '../stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import { getPlanById } from "prisma/models/planEstudioModel";

export default function PlanEdit() {
  const data = useLoaderData<typeof loader>();
  const [listaCursos, setListaCursos] = useState(data);
  const [nombrePlan, setNombrePlan] = useState(data.plan.nombre_plan);
  const [codigoPlan, setCodigoPlan] = useState(data?.plan?.codigo);
  const [importedScript, setImportedScript] = useState<any>();
  const DEFAULT_TOOLTIP_PLAN = "Nombre del plan de estudios"

  useEffect(() => {
    const importedScript = async () => {
      const module = await import("~/Scripts/FrontEnd/newPlan.js");
      const script = module.default;
      setImportedScript(script);
    };
    importedScript();
  }, []);

  let cursos = Object.values(listaCursos.cursos).map(curso => {
    return <li key={crypto.randomUUID()}>{curso}</li>
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.currentTarget.value !== ""
      ? setNombrePlan(event.currentTarget.value)
      : setNombrePlan("")
  }

  function handleCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.currentTarget.value !== ""
      ? setCodigoPlan(event.currentTarget.value)
      : setCodigoPlan("")
  }

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
            value={nombrePlan}
            required={true}
            onChange={handleChange} />
        </span>
        <div className="whiteContainer">
          <div>
            <label>
              Código:
              <input
                type="text"
                name="codigo"
                placeholder="Código✎"
                value={codigoPlan || ""}
                onChange={handleCodeChange} />
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
        <button type="submit">Actualizar</button>
        <button type="submit">Eliminar plan</button>
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  //Validar datos codigo, nombre
  const formData = await request.formData();
  const name = String(formData.get("name"));
  return redirect("/plan");
}

export const loader = async ({
  params,}: LoaderFunctionArgs) => {

  const planid = params.idplan;
  if (!planid || isNaN(Number(planid))) {
    throw new Response("Not found", { status: 404 });
  }
  const plan = await getPlanById(Number(planid));
  if (!plan) {
    throw new Response("Not found", { status: 404 });
  }

  const cursos = {
    0: "IF5584 Dummy Data",
  };
  return json({ cursos: cursos, plan: plan })

}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
];