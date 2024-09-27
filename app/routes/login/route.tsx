import { LinksFunction } from "@remix-run/node";
import loginStyles from "./loginStyles.css?url";
import appStyles from '~/stylesheets/plan_.new.css?url';
import { Form } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import actionLogin from "~/.server/Controller/login/action";
import loaderLogin from "~/.server/Controller/login/loader";

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

export const action = actionLogin;
export const loader = loaderLogin;