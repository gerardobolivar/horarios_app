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

  function getTimeStamp(user_date:string){
    let date = new Date(user_date);
    let stringDate = date.toLocaleDateString();
    let stringTime = date.toLocaleTimeString();
    return `${stringDate} a las ${stringTime}`
  }

  function handleChangeForm(event:any){
    //const username = String((document.getElementById("username") as HTMLInputElement).value);
    //submit(event.currentTarget);

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
                    placeholder=""
                    className="form-control"
                    required={true}
                    readOnly={isNewUser?false:true}
                    maxLength={30}
                    defaultValue={!isNewUser && user ? user.nombre_usuario : ""}
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
                  <p><strong>Modificado: </strong>
                  {!isNewUser && user ? <ReactTimeAgo date={new Date(new Date(user.fecha_modificado))}/>:null}
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