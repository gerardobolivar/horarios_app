import { ActionFunctionArgs, LinksFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import appStyles from '../stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import { createPlan } from "prisma/models/planEstudioModel";

export default function PlanNew() {
  const DEFAULT_TOOLTIP_PLAN = "Nombre del plan de estudios"
  const [nombrePlan, setNombrePlan] = useState(DEFAULT_TOOLTIP_PLAN);
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
            required={true}
            maxLength={100}
            onChange={handleChange} />
        </span>
        <div className="whiteContainer">
          <div>
            <label>
              Código:
              <input type="text"
                    name="codigo"
                    maxLength={10}
                    placeholder="Código✎" />
            </label>
          </div>
        </div>
        <button className="menu_bottom_btn" type="submit">Crear</button>
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("nombre"));
  const code = String(formData.get("codigo"));
  const USER_ID = 1; // Dev purposes // This will be taken from session.
  const plan =  await createPlan(name,code,USER_ID)
  const planId = plan.id_plan_estudio
  
  return redirect(`/plan/${planId}`)
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
];
