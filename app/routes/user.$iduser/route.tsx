import { Form, Link, Outlet, useLoaderData, useNavigation, useSubmit} from "@remix-run/react";
import { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { actionUserIdUser } from "~/.server/Controller/user.$iduser/action";
import { loaderUserIdUser } from "~/.server/Controller/user.$iduser/loader";

export default function ModalUsuario() {
  const navigation = useNavigation()
  const data = useLoaderData<typeof loader>();
  const isNewUser: boolean = data.isNewUser;
  const user = data.user;
  const hasHash = data.userHasHash;
  const [username, setUsername] = useState(!isNewUser && user ? user.nombre_usuario : "")

  function handleKeys(e:React.ChangeEvent<HTMLInputElement>){
    const input = e.currentTarget.value;
    const formatted_input = input.replace(/\s/g,'').toLocaleLowerCase()
    setUsername(formatted_input);
  }


  return <div className="overlay_styles" >
    <div className="modalContainer modalContainer-small">
      <h2>{isNewUser ? "Agregar Usuario":"Usuario"}</h2>
      <div className="body_container">
        <Form id="courseForm"
              method="post"
              autoComplete="off"
              name="form"
              preventScrollReset>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                <span>
                  <label htmlFor="username">usuario</label>
                  <input
                    id="username"
                    title="Nombre de usuario"
                    type="text"
                    name="username"
                    onChange={e=>{handleKeys(e)}}
                    value={username}
                    placeholder=""
                    className="form-control"
                    required={true}
                    readOnly={isNewUser?false:true}
                    maxLength={30}
                  />
                </span>
                  <Outlet/>
                <span>
                  <label htmlFor="profesorLab" >Rol de usuario</label>
                  <select 
                    name="user_role"
                    id="user_role"
                    required={true}
                    className="form-control"
                    defaultValue={user?.role} >
                    <option value={""}>Rol</option>
                    <option value={"ADMIN"}>ADMIN</option>
                    <option value={"USER"}>USER</option>
                    <option value={"GUEST"}>GUEST</option>
                  </select>
                </span>
                <span hidden={isNewUser}>
                  <p><strong>Creado: </strong>
                  {!isNewUser && user ? <ReactTimeAgo date={new Date(new Date(user.fecha_creado))}/>:null}
                  </p>
                  <p><strong>Última sesión: </strong>
                  {!isNewUser && user && hasHash? <ReactTimeAgo date={new Date(new Date(user.ultima_sesion!))}/>:"Inactivo"}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <div className="course_modal_btns">
            <button
              id="m_course_create"
              type="submit"
              className={navigation.state === "submitting" || navigation.state === "loading" ? "disabled mainButton" : "mainButton"}
              style={{marginLeft:"0px"}}
              name="intent"
              disabled={navigation.state === "submitting" || navigation.state === "loading"}
              value={isNewUser ? "create" : "update"}>
              {isNewUser ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/user`} preventScrollReset={true} className="">
              <button type="submit" className="mainButton cancel_btn">&times;</button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  </div>
}

export const action = actionUserIdUser;
export const loader = loaderUserIdUser;