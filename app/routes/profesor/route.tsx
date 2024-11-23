import { LinksFunction} from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import { FormEvent, useEffect, useState } from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import ConfirmationModal from "~/modals/ConfirmationModal";
import modalStyles from "~/modals/modalStyles.css?url";
import actionProfesor from "~/.server/Controller/profesor/action";
import loaderProfesor from "~/.server/Controller/profesor/loader";

const ROUTE_TAG = "Profesores";

export default function Profesor() {
  let data = useLoaderData<typeof loader>();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  const [currentProfesor,setCurrentProfesor] = useState(0);

  const profesorListaTable = data.listaProfesores.map((profesor) => {
    return <tr id={String(profesor.id_profesor)} key={profesor.id_profesor}>
    <td>{`${profesor.nombre} ${profesor.primer_apellido} ${profesor.segundo_apellido}`}</td>
    <td className="align-end">
      <Link
        to={`/profesor/${profesor.id_profesor}`}
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
          id={String(profesor.id_profesor)}
          value={profesor.id_profesor}
          onClick={(e)=>{handleEliminar(e)}}
          disabled={navigation.state === "submitting" || navigation.state === "loading" ? true : false}
          className="active mainButton">
            <i id={String(profesor.id_profesor)} className="bi bi-trash-fill"/>
        </button>
    </td>
  </tr>
  })


  

  function handleCellClick(e: any) {
  }

  function handleEliminar(e:FormEvent){
    const delete_btn = e.target as HTMLButtonElement;
    const user_id = Number(delete_btn.id);
    setCurrentProfesor(user_id);
    setShow(true);
  }

  useEffect(() => {
    if (navigation.state === "submitting" || navigation.state === "loading") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [navigation.state]);


  return (
    <div className="container-sm">
      <MainTitle innerText={ROUTE_TAG} />
      <Form autoComplete="off" method="post">
        <div className="whiteContainer" id="whiteContainerPlan">
          <div>
            <div>
            </div>
            <label>Profesores registrados:</label>
            <div className="whiteContainer whiteContainerTable">
              <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th className="align-end">Gestionar/Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profesorListaTable}
                  </tbody>
              </table>
            </div>
            <span className="horarios-plan-new-listacursos-buttons">
              <Link to={`/profesor/new`}
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
                text="¿Está seguro que desea eliminar el profesor?"
                action="/profesor"
                value={String(currentProfesor)} 
                setShow={setShow}/> : null}
    </div>
  )
}

export const action = actionProfesor;
export const loader = loaderProfesor;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
  { rel: "stylesheet", href: modalStyles },
];
