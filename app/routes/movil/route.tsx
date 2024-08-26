import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import { useEffect, useState } from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import { getMovileLabs, removeMobileLab } from "prisma/models/movileLab";
import ConfirmationModal from "~/modals/ConfirmationModal";
import modalStyles from "~/modals/modalStyles.css?url";

const ROUTE_TAG = "Laboratorios Móviles";

export default function Profesor() {
  let data = useLoaderData<typeof loader>();
  const [curretCellId, setCurretCellId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigation = useNavigation();
  const [show,setShow] = useState(false);

  
  let laboratoriosLista: any = data.listaMovileLabs.map((laboratorio) => {
    return <div
      className="noLinkDecoration dataRowLink"
      key={String(laboratorio.id_lab_mov)}
      onMouseDown={handleCellClick}>
      <div
        id={String(laboratorio.id_lab_mov) + "d"}>
        <h5 id={String(laboratorio.id_lab_mov)} className={`${curretCellId === String(laboratorio.id_lab_mov) ? "selected" : null} dataRow`}>
          {`${laboratorio.nombre}`}
        </h5>
      </div>
    </div>
  })

  function handleCellClick(e: any) {
    setCurretCellId(e.target.id);
  }

  function handleEliminar(){
    setShow(true);
  }

  useEffect(() => {
    if (navigation.state === "submitting" || navigation.state === "loading") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [navigation.state]);

  useEffect(() => {
    if(data.listaMovileLabs.length > 0){
      setCurretCellId(String(data.listaMovileLabs[data.listaMovileLabs.length-1].id_lab_mov));
    }else{
    setCurretCellId("");
    }
  }, [data.listaMovileLabs]);

  return (
    <div className="container-sm">
      <MainTitle innerText={ROUTE_TAG} />
      <Form autoComplete="off" method="post">
        <div className="whiteContainer" id="whiteContainerPlan">
          <div>
            <div>
            </div>
            <label>Laboratorios móviles disponibles:</label>
            <div className="whiteContainer whiteContainerTable">
              {laboratoriosLista}
            </div>
            <span className="horarios-plan-new-listacursos-buttons">
              <input id="labID" name='labID' hidden={true} defaultValue={curretCellId}></input>
              <Link to={`/movil/new`}
                preventScrollReset={true}>
                <button
                  type="button"
                  disabled={btnDisabled}
                  className={`${btnDisabled ? "disabled" : null} mainButton active`}>
                  Agregar</button>
              </Link>
              <Link to={`/movil/${curretCellId}`}
                preventScrollReset={true}>
                <button type="submit"
                  disabled={curretCellId === "" ? true : false}
                  className={curretCellId === "" ? "disabled" : "active"}>
                  Ver/Actualizar</button>
              </Link>
              <button
                type="button"
                onClick={handleEliminar}
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
      {show ? <ConfirmationModal 
                show={true} 
                currentCellId={curretCellId} 
                btnDisabled={btnDisabled}
                text="¿Está seguro que desea eliminar el laboratorio móvil?"
                action="/movil"
                value="delete_laboratorio" 
                setShow={setShow}/> : null}
    </div>
  )
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentLab = Number(formData.get("elementID"))

  if(intent === "delete_laboratorio"){
    await removeMobileLab(currentLab);
  }
  return redirect("/movil")
}

export const loader = async ({ params, }: LoaderFunctionArgs) => {
  const listaMovileLabs = await getMovileLabs();
  return json({ listaMovileLabs: listaMovileLabs })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
  { rel: "stylesheet", href: modalStyles },
];