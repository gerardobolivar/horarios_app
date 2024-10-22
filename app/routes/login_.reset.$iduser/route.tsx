import { Form, useLoaderData } from "@remix-run/react";
import actionResetUserID from "~/.server/Controller/login_.reset.$iduser/action";
import loaderResetUserID from "~/.server/Controller/login_.reset.$iduser/loader";
import loginStyles from "../login/loginStyles.css?url";
import appStyles from '~/stylesheets/plan_.new.css?url';

import { LinksFunction } from "@remix-run/node";

export default function Reset() {
  let data = useLoaderData<typeof loader>();


  return (
    <>
      <p className="title">Sistema de Horarios</p>
      <div className="loginContainer">
        <Form method="POST">
          <div>
          </div>
          <div >
            <input
              autoComplete="username"
              hidden></input>
            <label htmlFor="password">Nueva contraseña</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              required={true}
              minLength={8}
              maxLength={64} />
          </div>
          <div>
            <label>Confirme la contraseña:</label>
            <input
              type="password"
              name="passwordConf"
              autoComplete="new-password"
              required={true}
              minLength={8}
              maxLength={64}
            />
          </div>
          <div>
            <button name="intent" value="createPass" className="mainButton">Crear</button>
          </div>
        </Form>
      </div>
    </>
  )
}


export const loader = loaderResetUserID;
export const action = actionResetUserID;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: loginStyles },
  { rel: "stylesheet", href: appStyles }
];