import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useNavigation, useSubmit} from "@remix-run/react";
import {createUsuario, getUser, getUserByName, updateUsuarioRole} from "prisma/models/userModel"
import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";

export default function ModalUsuario() {
  const navigation = useNavigation()
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewUser: boolean = data.isNewUser;
  const user = data.user;
  const submit = useSubmit();

  useEffect(()=>{
    if(navigation.state === "submitting"){
      setBtnDisabled(true);
    }else{
      setBtnDisabled(false);
    }
  },[navigation.state])

  function getTimeStamp(user_date:string){
    let date = new Date(user_date);
    let stringDate = date.toLocaleDateString();
    let stringTime = date.toLocaleTimeString();
    return `${stringDate} a las ${stringTime}`
  }

  function handleChangeForm(event:any){
    const username = String((document.getElementById("username") as HTMLInputElement).value);
    console.log(username);
    
      submit(event.currentTarget);

  }
  return <div className="overlay_styles" >
    <div className="modalContainer">
      <h2>{isNewUser ? "Agregar Usuario":"Ver/Actualizar usuario"}</h2>
      <div className="body_container">
        <Form id="courseForm"
              method="post"
              autoComplete="off"
              name="form"
              onBlur={handleChangeForm}
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
                    className=""
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
                    defaultValue={user?.role} >
                    <option value={""}>Rol</option>
                    <option value={String(UserRole.ADMIN)}>ADMIN</option>
                    <option value={String(UserRole.USER)}>USER</option>
                    <option value={String(UserRole.GUEST)}>GUEST</option>
                  </select>
                </span>
                <span hidden={isNewUser}>
                  <p><strong>Modificado:</strong>
                  {!isNewUser && user ? ` ${getTimeStamp(user.fecha_modificado)}`: ""}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <div className="course_modal_btns">
            <button
              id="m_course_create"
              type="submit"
              className={btnDisabled ? "disabled" : ""}
              name="intent"
              disabled={btnDisabled}
              value={isNewUser ? "create" : "update"}>
              {isNewUser ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/user`} preventScrollReset={true}>
              <button type="submit" className="mainButton">Cancelar</button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  </div>
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username")).toLocaleLowerCase();
  const role = String(formData.get("user_role"));
  const intent = formData.get("intent");
  let user_role:UserRole;

  switch (role) {
    case "ADMIN": 
      user_role = UserRole.ADMIN;
      break;
    case "USER":
      user_role = UserRole.USER;
      break;
    default:
      user_role = UserRole.GUEST
  }
  
  if (intent === "create") {
    console.log(`Saving as: ${user_role}`);
    try {
      const user = await createUsuario(username,user_role);
      
    } catch (errors) {
      console.log(errors);
    }
    
  }else if (intent === "update"){
    const iduser = Number(params.iduser);
    await updateUsuarioRole(iduser,user_role)
  }
  else{
    console.log("Looking for this username on db");
    const result = await getUserByName(username)
    console.log(result);
    if(result?.nombre_usuario === username){
      return redirect(`/user/new/error`)
    }
    return redirect(`/user/new/`)
    
  }
  return redirect(`/user/`)
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const isNewUser:boolean = params.iduser === "new";
  const iduser:number = Number(params.iduser);
  return json({ isNewUser: isNewUser, user: isNewUser ? null: await getUser(iduser)})
}