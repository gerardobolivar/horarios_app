import { LinksFunction } from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import { FormEvent, useEffect, useState } from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import modalStyles from "~/modals/modalStyles.css?url";
import ConfirmationModal from "~/modals/ConfirmationModal";
import actionAula from "~/.server/Controller/aula/action";
import loaderAula from "~/.server/Controller/aula/loader";

const ROUTE_TAG = "Aulas";

export default function Aulas() {
  let data = useLoaderData<typeof loader>();
  const [curretCellId, setCurretCellId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [currentAula,setCurrentAula] = useState(0);

  const aulasListaTable = data.listaAulas.map((aula) => {
    return <tr id={String(aula.id_aula)} key={aula.id_aula}>
    <td>{`Aula ${Number(aula?.identificador) < 10 ? "0"+aula?.identificador: aula?.identificador === 999 ? "Virtual" : aula?.identificador}`}</td>
    <td className="align-end">
      <Link
        to={`/aula/${aula.id_aula}`}
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
          id={String(aula.id_aula)}
          value={aula.id_aula}
          onClick={(e)=>{handleEliminar(e)}}
          disabled={navigation.state === "submitting" || navigation.state === "loading" ? true : false}
          className="active mainButton">
            <i id={String(aula.id_aula)} className="bi bi-trash-fill"/>
        </button>
    </td>
  </tr>
  })

  function handleCellClick(e: any) {
    setCurretCellId(e.target.id);
  }

  function handleEliminar(e: FormEvent){
    const delete_btn = e.target as HTMLButtonElement;
    const aula_id = Number(delete_btn.id);
    setCurrentAula(aula_id);
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
    if(data.listaAulas.length > 0){
      setCurretCellId(String(data.listaAulas[data.listaAulas.length-1].id_aula));
    }else{
    setCurretCellId("");
    }
  }, [data.listaAulas]);

  return (
    <div className="container-sm">
      <MainTitle innerText={ROUTE_TAG} />
      <Form autoComplete="off" method="post">
        <div className="whiteContainer" id="whiteContainerPlan">
          <div>
            <div>
            </div>
            <label>Aulas registradas:</label>
            <div className="whiteContainer whiteContainerTable">
            <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Indentificador</th>
                    <th className="align-end">Gestionar/Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {aulasListaTable}
                </tbody>
              </table>
            </div>
            <span className="horarios-plan-new-listacursos-buttons">
              <input id="elementID" name='elementID' hidden={true} defaultValue={curretCellId}></input>
              <Link to={`/aula/new`}
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
                text="¿Está seguro que desea eliminar el aula?"
                action="/aula"
                value={String(currentAula)} 
                setShow={setShow}/> : null}
    </div>
  )
}

export const action = actionAula;
export const loader = loaderAula;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: modalStyles },
];
