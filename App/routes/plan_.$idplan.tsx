import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import appStyles from '../stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import { getPlanById, removePlan, updatePlan } from "prisma/models/planEstudioModel";
import ModalCourse from "~/Components/plan_estudio/modal_curso";
import { createCourse } from "prisma/models/courseModel";

export default function PlanEdit() {
  const data = useLoaderData<typeof loader>();
  const [listaCursos, setListaCursos] = useState(data);
  const [nombrePlan, setNombrePlan] = useState(data.plan.nombre_plan);
  const [codigoPlan, setCodigoPlan] = useState(data?.plan?.codigo);
  const [modal, setModal] = useState(false);
  //const [createBtnState,setCreateBtnState] = useState(false);
  const [importedScript, setImportedScript] = useState<any>();
  const DEFAULT_TOOLTIP_PLAN = "Nombre del plan de estudios";

  // How to import JavaScript script when needed. This script will be loaded in the client end. 
  useEffect(() => {
    const importedScript = async () => {
      const module = await import("~/Scripts/FrontEnd/newCourse.js");
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

  function handleModalChange(event: any) {
    setModal(true);
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
              <button type="button" onClick={handleModalChange}>Agregar</button>
              <button type="button">Eliminar</button>
              <button type="button">Ver</button>
            </span>
          </div>
        </div>
        <button className="menu_bottom_btn" name="intent" type="submit" value="update" >Actualizar</button>
        <button className="menu_bottom_btn_remove" name="intent" type="submit" value="delete">Eliminar plan</button>
      </Form>
      <ModalCourse state={modal} setState={setModal}></ModalCourse>
    </div>
  )
}

export async function action({ request, params }: ActionFunctionArgs) {
  //Validar datos codigo, nombre
  const formData = await request.formData();
  const name = String(formData.get('nombre'));
  const intent = formData.get('intent');
  const code = String(formData.get('codigo'));
  if (intent == 'delete') {
    await removePlan(Number(params.idplan));
    return redirect("/plan")
  }
  else if (intent == "modal_cancel") {
    return redirect(`/plan/${params.idplan}`);
  }
  else if (intent == "modal_course_create") {
    const name = String(formData.get("course_name"));
    const sigla = String(formData.get("sigla"));
    const idplan = Number(params.idplan);
    const horas = String(formData.get("horas"));
    const tipo = String(formData.get("tipo"));
    const course = await createCourse(name, sigla, idplan, horas, tipo);

    return redirect(`/plan/${params.idplan}`);

  }
  else if (intent == "update") {
    await updatePlan(Number(params.idplan), name, code);
    return redirect("/plan");
  }
  return null;

}

export const loader = async ({
  params, }: LoaderFunctionArgs) => {
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
