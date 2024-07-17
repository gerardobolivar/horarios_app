import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, json, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import appStyles from '../stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import { getPlanById, removePlan, updatePlan } from "prisma/models/planEstudioModel";
import ModalCourse from "~/Components/plan_estudio/modal_curso";
import { createCourse, getCourses, getCoursesbyPlan } from "prisma/models/courseModel";

export default function PlanEdit() {
  const data = useLoaderData<typeof loader>();
  const [listaCursos, setListaCursos] = useState(data.cursos);
  const [nombrePlan, setNombrePlan] = useState(data.plan.nombre_plan);
  const [codigoPlan, setCodigoPlan] = useState(data?.plan?.codigo);
  const [modal, setModal] = useState(false);
  const [curretCellId, setCurretCellId] = useState("");
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

  let cursos = Object.values(listaCursos).map(curso => {
    return <li key={curso.id_curso}>{`${curso.sigla}-${curso.nombre}`}</li>
  })

  let cursosLista:any = listaCursos.map((curso) => {
    return <tr onClick={handleCellClick} key={String(curso.id_curso)}> <td id={String(curso.id_curso)}>{`${curso.sigla} - ${curso.nombre}`}</td> </tr>
    
  })

  function handleCellClick(e:any){
    setCurretCellId(e.target.id);
  }

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
            <div className="whiteContainer whiteContainerTable">
            <table>
              <tbody className="dataTable">
                {cursosLista}
              </tbody>
            </table>
            </div>
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
      <ScrollRestoration></ScrollRestoration>
    </div>
  )
}

export async function action({ request, params }: ActionFunctionArgs) {
  //Validar datos codigo, nombre
  const formData = await request.formData();
  const name = String(formData.get('nombre'));
  const intent = formData.get('intent');
  const code = String(formData.get('codigo'));
  let goTo = "";
  if (intent == 'delete') {
    await removePlan(Number(params.idplan));
    goTo = "/plan";
  }
  else if (intent == "modal_cancel") {
    goTo = `/plan/${params.idplan}`;
  }
  else if (intent == "modal_course_create") {
    const name = String(formData.get("course_name")).toLocaleUpperCase();
    const sigla = String(formData.get("sigla")).toLocaleUpperCase();
    const idplan = Number(params.idplan);
    const horas = String(formData.get("horas"));
    const tipo = String(formData.get("tipo"));
    const curso = await createCourse(name, sigla, idplan, horas, tipo);
    if (curso) {
      return redirect(`/plan/${params.idplan}`);
    }
  }
  else if (intent == "update") {
    await updatePlan(Number(params.idplan), name, code);
    goTo = "/plan";
  }

  return redirect(goTo);
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
  const listaCursos = await getCoursesbyPlan(Number(planid));



  const cursos = {
    0: "IF5584 Dummy Data",
  };

  return json({ cursos: listaCursos, plan: plan })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
];
