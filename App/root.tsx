import { Outlet, Links, Scripts, Meta, json, useLoaderData, ScrollRestoration, LiveReload, useRouteError, } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import appStyles from "./old-app/Styles/app.css?url";
import bootstrap from "bootstrap/dist/css/bootstrap.css?url";
import MainLayout from "./old-app/Layouts/Main";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: bootstrap },
];

export default function App() {
  return (
    <html lang="es-013">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1,  maximum-scale=1.0, user-scalable=0" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Web site for managing courses inscriptions" />
        <meta name="author" content="Gerardo Vargas Fernández" />
        <meta name="email" content="geramena102@gmail.com" />
        <Meta />
        <Links />
      </head>
      <body id="body">
        <div id="root" className="container-lg">
          <MainLayout />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  )
}

//export const meta: MetaFunction = ({ location }) => {}

export async function loader() {
  return json({ok:true})
}


export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <h1>KABOOM 💥... You made it explode!!</h1>
        <p>This is ok, error happens sometimes.</p>
        <p>Make sure to take note about the error and send it to the dev.</p>
        <br/>
        <h1>Error info</h1>
        {
          `${error}`
        }
        <Scripts />
      </body>
    </html>
  );
}