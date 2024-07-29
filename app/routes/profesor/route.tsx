import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import { useEffect, useState } from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import { getProfesores, removeProfesor } from "prisma/models/profesorModel";
const ROUTE_TAG = "Profesores";

export default function Profesor() {
  let data = useLoaderData<typeof loader>();
  const [curretCellId, setCurretCellId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigation = useNavigation();
  let profesoresLista: any = data.listaProfesores.map((profesor) => {
    return <div
      className="noLinkDecoration dataRowLink"
      key={String(profesor.id_profesor)}
      onMouseDown={handleCellClick}>
      <div
        id={String(profesor.id_profesor) + "d"}>
        <h5 id={String(profesor.id_profesor)} className={`${curretCellId === String(profesor.id_profesor) ? "selected" : null} dataRow`}>
          {`${profesor.nombre} ${profesor.primer_apellido} ${profesor.segundo_apellido}`}
        </h5>
      </div>
    </div>
  })

  function handleCellClick(e: any) {
    setCurretCellId(e.target.id);
  }

  useEffect(() => {
    if (navigation.state === "submitting" || navigation.state === "loading") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [navigation.state]);

  useEffect(() => {
    if(data.listaProfesores.length > 0){
      setCurretCellId(String(data.listaProfesores[data.listaProfesores.length-1].id_profesor));
    }else{
    setCurretCellId("");
    }
  }, [data.listaProfesores]);

  return (
    <div className="container-sm">
      <MainTitle innerText={ROUTE_TAG} />
      <Form autoComplete="off" method="post">
        <div className="whiteContainer" id="whiteContainerPlan">
          <div>
            <div>
            </div>
            <label>Aulas disponibles:</label>
            <div className="whiteContainer whiteContainerTable">
              {profesoresLista}
            </div>
            <span className="horarios-plan-new-listacursos-buttons">
              <input id="profesorID" name='profesorID' hidden={true} defaultValue={curretCellId}></input>
              <Link to={`/profesor/new`}
                preventScrollReset={true}>
                <button
                  type="button"
                  disabled={btnDisabled}
                  className={`${btnDisabled ? "disabled" : null} mainButton active`}>
                  Agregar</button>
              </Link>
              <Link to={`/profesor/${curretCellId}`}
                preventScrollReset={true}>
                <button type="submit"
                  disabled={curretCellId === "" ? true : false}
                  className={curretCellId === "" ? "disabled" : "active"}>
                  Ver/Actualizar</button>
              </Link>
              <button name="intent"
                value="delete_profesor"
                type="submit"
                disabled={curretCellId === "" || btnDisabled ? true : false}
                className={`${curretCellId === "" || btnDisabled ? "disabled" : "active"}`}>
                Eliminar</button>
            </span>
          </div>
          <div>
          </div>
        </div>
        <Link to={"/"}>
          <button className="mainButton" >Regresar</button>
        </Link>
      </Form>
      <Outlet/>
    </div>
  )
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentProfesor = Number(formData.get("profesorID"))

  if(intent === "delete_profesor"){
    await removeProfesor(currentProfesor);
  }
  return redirect("/profesor")
}

export const loader = async ({ params, }: LoaderFunctionArgs) => {
  const listaProfesores = await getProfesores();

  return json({ listaProfesores: listaProfesores })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
];
