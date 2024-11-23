import { LinksFunction } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useNavigate, useNavigation, useRouteError } from "@remix-run/react";
import { useEffect, useState} from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import actionIdplan from "~/.server/Controller/plan_.$idplan/action";
import loaderIdplan from "~/.server/Controller/plan_.$idplan/loader";

export default function PlanEdit() {
  const data = useLoaderData<typeof loader>();
  const [nombrePlan, setNombrePlan] = useState(data.plan.nombre_plan);
  const [codigoPlan, setCodigoPlan] = useState(data?.plan?.codigo);
  const [curretCellId, setCurretCellId] = useState("");
  const [previousString, setPreviousString] = useState(nombrePlan + codigoPlan);
  const [noChange, setNoChange] = useState(true);
  const navigation = useNavigation();
  

  useEffect(() => {
    const newString = nombrePlan + codigoPlan
    if (newString !== previousString) {
      setNoChange(false);
    } else {
      setNoChange(true);
    }
  }, [nombrePlan, codigoPlan]);
  
  useEffect(() => {
    //setCurretCellId("");
    if(data.cursos.length > 0){
      setCurretCellId(String(data.cursos[data.cursos.length-1].id_curso));
    }else{
    setCurretCellId("");
    }
  }, [data.cursos]);
  

  let cursosLista: any = data.cursos.map((curso) => {
    return <div
      className="noLinkDecoration dataRowLink"
      key={String(curso.id_curso)}
      onMouseDown={handleCellClick}>
      <div
        id={String(curso.id_curso) + "d"}>
        <h5 id={String(curso.id_curso)} className={`${curretCellId === String(curso.id_curso)?"selected":null} dataRow`}>
          {`${curso.sigla} - ${curso.nombre}`}
        </h5>
      </div>
    </div>
  })

  const cursosListaTable = data.cursos.map((curso) => {
    return <tr id={String(curso.id_curso)} key={curso.id_curso}>
      <td>{`${curso.sigla}-${curso.nombre}`}</td>
      <td className="align-end">
        <Link
          to={`/plan/${data.plan.id_plan_estudio}/${curso.id_curso}`}
          preventScrollReset={true}>
            <button
              type="submit"
              disabled={curretCellId === "" || navigation.state === "loading" || navigation.state === "submitting" ? true : false}
              className={curretCellId === "" ? "disabled mainButton" : "active mainButton"}>
                <i className="bi bi-eye-fill"></i>
            </button>
        </Link>
        <button 
          name="intent"
          value={`delete_course,${curso.id_curso}`}
          id={String(curso.id_curso)}
          type="submit"
          disabled={navigation.state === "loading" || navigation.state === "submitting" ? true : false}
          className={`${curretCellId === ""  ? "disabled mainButton":"active mainButton"}`}>
            <i  className="bi bi-trash-fill"></i>
        </button>
      </td>
    </tr>
  })

  function handleCellClick(e: any) {
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

  return (
    <div className="container">
      <div>
        <Form autoComplete="off" method="post">
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
              <label>Cursos:</label>
              <div className="whiteContainer whiteContainerTable">
                <table className="table table-striped myTable">
                  <thead>
                    <tr>
                      <th>Curso</th>
                      <th className="align-end">Gestionar/Elimninar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursosListaTable}
                  </tbody>
                </table>
              </div>
              <span className="horarios-plan-new-listacursos-buttons">
                <Link to={`/plan/${data.plan.id_plan_estudio}/new`}
                  preventScrollReset={true}>
                  <button
                    type="button"
                    disabled={navigation.state === "loading" || navigation.state === "submitting" }
                    className="mainButton active">
                      Agregar</button>
                </Link>
              </span>
            </div>
            <span className="manage_plan_btns">
              <button className={`${noChange ? "disabled" : "active"} manage_plan_btn`}
                    name="intent"
                    type="submit"
                    value="update"
                    disabled={noChange || navigation.state === "loading" || navigation.state === "submitting" }>
                      Actualizar plan
            </button>
            <button 
              className={`${data.cursos.length > 0 ? "disabled" : "active"} menu_bottom_btn_remove tooltip_ manage_plan_btn`}
              name="intent"
              type="submit"
              disabled={data.cursos.length > 0 || navigation.state === "loading" || navigation.state === "submitting" }
              value="delete">
                Eliminar plan
                <span
                  className="tooltiptext no-select"
                  style={{left:"100px"}}
                  hidden={!(data.cursos.length > 0)}>No se puede eliminar un plan con cursos asociados.</span>
                </button>
            </span>
          </div>
        </Form>
      </div>
      <Outlet/>
    </div>
  )
}

export const action = actionIdplan;
export const loader = loaderIdplan;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
];

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  const navigate = useNavigate();
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