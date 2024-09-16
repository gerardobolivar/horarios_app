import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import loginStyles from "./loginStyles.css?url";
import appStyles from '~/stylesheets/plan_.new.css?url';
import { Form, redirect } from "@remix-run/react";
import { validateUser } from "prisma/models/userModel";
import { createUserSession, getUserId } from "~/.server/session";
import { useOptionalUser } from "~/utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: loginStyles },
  { rel: "stylesheet", href: appStyles },
];

export default function login() {

  const user = useOptionalUser();
  

  return <>
      <p className="title">Sistema de Horarios</p>
    <div className="loginContainer">
      <Form method="POST">
        <h3>Iniciar sesión</h3>
        <div>
        </div>
        <div >
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            name="username"
            autoComplete="username"
            maxLength={30} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            maxLength={50}
          />
        </div>
        <div>
          <button name="intent" value="login" className="mainButton">Ingresar</button>
        </div>
      </Form>
    </div>
  </>
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username")); 
  const password = String(formData.get("password")); 

  const userID = await validateUser(password,username);


  return userID ? createUserSession({request, userId: userID!}) : null
}

export const loader = async ({ params, request}: LoaderFunctionArgs) => {
  const userID = await getUserId(request);
  
  if(userID){
    return redirect("/");
  }

  return json({});
}
