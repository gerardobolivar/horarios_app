import { LinksFunction } from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import { FormEvent, useEffect, useState } from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import ConfirmationModal from "~/modals/ConfirmationModal";
import modalStyles from "~/modals/modalStyles.css?url";
import { loaderUser } from "~/.server/Controller/user/loader";
import { actionUser } from "~/.server/Controller/user/action";

const ROUTE_TAG = "Usuarios";

export default function Usuarios() {
  let data = useLoaderData<typeof loader>();
  const [curretCellId, setCurretCellId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigation = useNavigation();
  const [show,setShow] = useState(false);
  const [currentUser,setCurrentUser] = useState(0);
  const [navState, setNavState] = useState(navigation.state);

  useEffect(() => {
    setNavState(navigation.state);
  }, [navigation.state]);

  const usuariosListaTable = data.listaUsuarios.map((usuario) => {
    return <tr id={String(usuario.id_usuario)} key={usuario.id_usuario}>
      <td>{usuario.nombre_usuario}</td>
      <td className="align-end">
        <Link
          to={`/user/${usuario.id_usuario}`}
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
            id={String(usuario.id_usuario)}
            value={usuario.id_usuario}
            onClick={(e)=>{handleEliminar(e)}}
            disabled={navigation.state === "submitting" || navigation.state === "loading" ? true : false}
            className="active mainButton">
              <i id={String(usuario.id_usuario)} className="bi bi-trash-fill"/>
          </button>
      </td>
    </tr>
  })

  function handleCellClick(e: any) {
    setCurretCellId(e.target.id);
  }

  function handleEliminar(e:FormEvent){ 
    const delete_btn = e.target as HTMLButtonElement;
    const user_id = Number(delete_btn.id);
    setCurrentUser(user_id);
    setShow(true);
  }

  useEffect(() => {
    if(data.listaUsuarios.length > 0){
      setCurretCellId(String(data.listaUsuarios[data.listaUsuarios.length-1].id_usuario));
    }else{
    setCurretCellId("");
    }
  }, [data.listaUsuarios]);

  return (
    <div className="container-sm">
      <MainTitle innerText={ROUTE_TAG} />
      <Form autoComplete="off" method="post">
        <div className="whiteContainer" id="whiteContainerPlan">
          <div>
            <div>
            </div>
            <label>Usuarios del sistema:</label>
            <div className="whiteContainer whiteContainerTable">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nombre de usuario</th>
                    <th className="align-end">Gestionar/Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosListaTable}
                </tbody>
              </table>
            </div>
            <span className="horarios-plan-new-listacursos-buttons">
              <input id="currentUserID" name='currentUserID' hidden={true} defaultValue={curretCellId}></input>
              <Link to={`/user/new`}
                preventScrollReset={true}>
                <button
                  type="button"
                  disabled={navigation.state === "submitting" || navigation.state === "loading"}
                  className="mainButton active">
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
                text={`¿Está seguro que desea eliminar el usuario?`}
                action="/user"
                value={String(currentUser)} 
                setShow={setShow}/> : null}
    </div>
  )
}

export const action = actionUser;
export const loader = loaderUser;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
  { rel: "stylesheet", href: modalStyles },
];
