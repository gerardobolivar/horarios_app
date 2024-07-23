import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, Link, Outlet, useLoaderData, useNavigate, useRouteError } from "@remix-run/react";
import { useEffect, useState } from "react";
import appStyles from '../stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import { getPlanById, removePlan, updatePlan } from "prisma/models/planEstudioModel";
import { countCoursesById, getCoursesbyPlan, removeCourse } from "prisma/models/courseModel";

export default function PlanEdit() {
  const data = useLoaderData<typeof loader>();
  const [listaCursos, setListaCursos] = useState(data.cursos);
  const [nombrePlan, setNombrePlan] = useState(data.plan.nombre_plan);
  const [codigoPlan, setCodigoPlan] = useState(data?.plan?.codigo);
  const [modal, setModal] = useState(false);
  const [curretCellId, setCurretCellId] = useState("");
  const [previousCellId, setPreviousCellId] = useState("");
  const [previousString, setPreviousString] = useState(nombrePlan+codigoPlan);
  const [importedScript, setImportedScript] = useState<any>();
  const [noChange, setNoChange] = useState(true);
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

  useEffect(() => {
    document.getElementById(`${curretCellId}d`)?.classList.add("selected");
    document.getElementById(`${curretCellId}`)?.classList.add("selected");
    document.getElementById(`${previousCellId}`)?.classList.remove("selected");
    document.getElementById(`${previousCellId}d`)?.classList.remove("selected");
  }, [curretCellId]);

  useEffect(() => {
    const newString = nombrePlan+codigoPlan
    if(newString !== previousString){
      console.log("Change detected");
      setNoChange(false);
    }else{
      console.log("No change detected");
      setNoChange(true);
    }
  }, [nombrePlan,codigoPlan]);


  let cursosLista: any = listaCursos.map((curso) => {
    return <div
      className="noLinkDecoration dataRowLink"
      key={String(curso.id_curso)}
      onMouseDown={handleCellClick}
      onFocusCapture={handleFocus}>
      <div
        id={String(curso.id_curso) + "d"}>
        <h5 id={String(curso.id_curso)} className={"dataRow"}>
          {`${curso.sigla} - ${curso.nombre}`}
        </h5>
      </div>
    </div>
  })

  function handleCellClick(e: any) {
    setPreviousCellId(curretCellId)
    setCurretCellId(e.target.id);
  }

  function handleFocus(e: any) {
    console.log("Event triggered!");
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

  return (
    <div className="container">
      <div>
        <form method="post" autoComplete="off">
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
              maxLength={100}
              onChange={handleChange} />
          </span>
          <div className="whiteContainer" id="whiteContainerPlan">
            <div>
              <label>
                Código:
                <input
                  type="text"
                  name="codigo"
                  placeholder="Código✎"
                  value={codigoPlan || ""}
                  maxLength={10}
                  onChange={handleCodeChange} />
              </label>
            </div>

            <div>
              <div>
              </div>
              <label>Cursos asociados:</label>
              <div className="whiteContainer whiteContainerTable">
                {cursosLista}
              </div>
              <span className="horarios-plan-new-listacursos-buttons">
                <input id="courseID" name='courseID' hidden={true} defaultValue={curretCellId}></input>
                <Link to={`/plan/${data.plan.id_plan_estudio}/new`}
                  preventScrollReset={true}>
                  <button type="button" className="mainButton">Agregar</button>
                </Link>
                <Link to={`/plan/${data.plan.id_plan_estudio}/${curretCellId}`}
                  preventScrollReset={true}>
                  <button type="submit"
                    disabled={curretCellId === "" ? true : false}
                    className={curretCellId === "" ? "disabled" : ""}>
                    Ver/Actualizar</button>
                </Link>
                <button name="intent"
                  type="submit"
                  value="delete_course"
                  disabled={curretCellId === "" ? true : false}
                  className={curretCellId === "" ? "disabled" : ""}>
                  Eliminar</button>
              </span>
            </div>
            <div>
            </div>
          </div>
          <Link to={"/plan"}>
            <button className="mainButton" >Regresar</button>
          </Link>
          <button className={noChange ? "menu_bottom_btn disabled": "menu_bottom_btn"} name="intent" type="submit" value="update" disabled={noChange}>Actualizar</button>
          <button className="menu_bottom_btn_remove"
                  name="intent"
                  type="submit"
                  value="delete">Eliminar plan</button>
        </form>
      </div>
      <Outlet />
    </div>
  )
}

export async function action({ request, params }: ActionFunctionArgs) {
  //Validar datos codigo, nombre
  const formData = await request.formData();
  const name = String(formData.get('nombre'));
  const intent = formData.get('intent');
  const code = String(formData.get('codigo'));
  const courseID = Number(formData.get('courseID'));

  let goTo = "";
  if (intent == 'delete') {
    const coursesCount = await countCoursesById(Number(params.idplan));
    if (coursesCount.id_curso == 0) {
      console.log(coursesCount);
      await removePlan(Number(params.idplan));
      goTo = "/plan";
    } else {
      let error = new Error("Plan contiene cursos")
      throw error;
    }
  }
  else if (intent == "update") {
    await updatePlan(Number(params.idplan), name, code);
    goTo = "/plan";
  }
  else if (intent == "delete_course" && courseID != 0) {
    //This should show up a warning
    try {
      await removeCourse(courseID).then();
      goTo = `/plan/${Number(params.idplan)}`
    } catch (error) {

    }
  }

  return redirect(goTo);
}

export const loader = async ({
  params, }: LoaderFunctionArgs) => {
  const planid = params.idplan;
  const plan = await getPlanById(Number(planid));
  const listaCursos = await getCoursesbyPlan(Number(planid));


  if (!planid || isNaN(Number(planid))) {
    throw new Response("Not found", { status: 404 });
  }
  if (!plan) {
    throw new Response("Not found", { status: 404 });
  }
  return json({ cursos: listaCursos, plan: plan })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
];

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.log(error);

  function goBack() {
    navigate(-1);
  }
  return (
    <div>
      <h5>Acción no permitida</h5>
      <h6 style={{ "color": "red" }}>{`${error}`}</h6>
      <button onClick={goBack}>Go back</button>
    </div>
  );
}