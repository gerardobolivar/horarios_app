import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import { useEffect, useState } from "react";
import appStyles from '~/stylesheets/plan_.new.css?url';
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import { getUsers, removeUsuario } from "prisma/models/userModel";
import ConfirmationModal from "~/modals/ConfirmationModal";
import modalStyles from "~/modals/modalStyles.css?url";

const ROUTE_TAG = "Usuarios";

export default function Usuarios() {
  let data = useLoaderData<typeof loader>();
  const [curretCellId, setCurretCellId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const navigation = useNavigation();
  const [show,setShow] = useState(false);
  let usuariosLista: any = data.listaUsuarios.map((usuario) => {

    return <div
      className="noLinkDecoration dataRowLink"
      key={String(usuario.id_usuario)}
      onMouseDown={handleCellClick}>
      <div
        id={String(usuario.id_usuario) + "d"}>
        <h5 id={String(usuario.id_usuario)} className={`${curretCellId === String(usuario.id_usuario) ? "selected" : null} dataRow`}>
          {`${usuario.nombre_usuario}`}
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
              {usuariosLista}
            </div>
            <span className="horarios-plan-new-listacursos-buttons">
              <input id="currentUserID" name='currentUserID' hidden={true} defaultValue={curretCellId}></input>
              <Link to={`/user/new`}
                preventScrollReset={true}>
                <button
                  type="button"
                  disabled={btnDisabled}
                  className={`${btnDisabled ? "disabled" : null} mainButton active`}>
                  Agregar</button>
              </Link>
              <Link to={`/user/${curretCellId}`}
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
                text={`¿Está seguro que desea eliminar el usuario?`}
                action="/user"
                value="delete_usuario" 
                setShow={setShow}/> : null}
    </div>
  )
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentUsuario = Number(formData.get("elementID"))

  if(intent === "delete_usuario"){
    await removeUsuario(currentUsuario);
  }
  return redirect("/user")
}

export const loader = async ({ params, }: LoaderFunctionArgs) => {
  const listaUsuarios = await getUsers();

  return json({ listaUsuarios: listaUsuarios })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: icons },
  { rel: "stylesheet", href: modalStyles },
];
