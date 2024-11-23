import { LinksFunction } from "@remix-run/node"
import { Form, FormEncType, Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import { FormEvent, useEffect, useState } from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import ConfirmationModal from "~/modals/ConfirmationModal";
import modalStyles from "~/modals/modalStyles.css?url";
import actionMobile from "~/.server/Controller/mobile/action";
import { loaderMobile } from "~/.server/Controller/mobile/loader";

const ROUTE_TAG = "Laboratorios Móviles";

export default function Profesor() {
  let data = useLoaderData<typeof loader>();
  const [curretCellId, setCurretCellId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigation = useNavigation();
  const [show,setShow] = useState(false);
  const [currentLab,setCurrentLab] = useState(0);
  
  const labsListaTable = data.listaMovileLabs.map((laboratorio) => {
    return <tr id={String(laboratorio.id_lab_mov)} key={laboratorio.id_lab_mov}>
    <td>{laboratorio.nombre}</td>
    <td className="align-end">
      <Link
        to={`/movil/${laboratorio.id_lab_mov}`}
        preventScrollReset={true}>
          <button 
            type="submit"
            disabled={navigation.state === "submitting" || navigation.state === "loading"}
            className="active mainButton">
            <i className="bi bi-eye-fill"></i>
          </button>
        </Link>
        <button
          type="button"
          id={String(laboratorio.id_lab_mov)}
          value={laboratorio.id_lab_mov}
          onClick={(e)=>{handleEliminar(e)}}
          disabled={navigation.state === "submitting" || navigation.state === "loading" ? true : false}
          className="active mainButton">
            <i id={String(laboratorio.id_lab_mov)} className="bi bi-trash-fill"/>
        </button>
    </td>
  </tr>
  })


  function handleCellClick(e: any) {
    setCurretCellId(e.target.id);
  }

  function handleEliminar(e:FormEvent){
    const delete_btn = e.target as HTMLButtonElement;
    const lab_id = Number(delete_btn.id);
    setCurrentLab(lab_id);
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
            <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th className="align-end">Gestionar/Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {labsListaTable}
                </tbody>
              </table>
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
            </span>
          </div>
          <div>
          </div>
        </div>
      </Form>
      <Outlet/>
      {show ? <ConfirmationModal 
                show={true} 
                btnDisabled={btnDisabled}
                text="¿Está seguro que desea eliminar el laboratorio móvil?"
                action="/movil"
                value={String(currentLab)} 
                setShow={setShow}/> : null}
    </div>
  )
}

export const action = actionMobile; 
export const loader = loaderMobile;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
  { rel: "stylesheet", href: modalStyles },
];