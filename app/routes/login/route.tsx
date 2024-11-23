import { LinksFunction } from "@remix-run/node";
import loginStyles from "./loginStyles.css?url";
import appStyles from '~/stylesheets/plan_.new.css?url';
import { Form } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import actionLogin from "~/.server/Controller/login/action";
import loaderLogin from "~/.server/Controller/login/loader";
import { useState } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: loginStyles },
  { rel: "stylesheet", href: appStyles },
];

export default function login() {
  const [username, setUsername] = useState("");

  const user = useOptionalUser();

  function handleKeys(e:React.ChangeEvent<HTMLInputElement>){
    const input = e.currentTarget.value;
    const formatted_input = input.replace(/\s/g,'').toLocaleLowerCase()
    setUsername(formatted_input);
  }

  

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
            onChange={e=>{handleKeys(e)}}
            name="username"
            autoComplete="username"
            value={username}
            className="form-control"
            maxLength={30} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            className="form-control"
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