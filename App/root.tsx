import { Outlet, Links, Scripts, Meta, json, useLoaderData,} from "@remix-run/react";
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
        <link rel="icon" href="favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Web site for managing courses inscriptions" />
        <meta name="author" content="Gerardo Vargas Fernández" />
        <meta name="email" content="geramena102@gmail.com" />
        <Links />
        <Meta />
      </head>
      <body>
        <div id="root">
          <MainLayout />
          <Outlet />
          <Scripts />
        </div>
      </body>
    </html>
  )
}

export const meta: MetaFunction = ({ location }) => {
  const data = useLoaderData<typeof loader>();
  const isHome = location.pathname === "/"
  if (isHome) {
    return [
      { title: `${data.appName} | HOME` }
    ];
  } else {
    return [];
  }
}

export async function loader() {
  const ENVIROMENT = import.meta.env.MODE ? import.meta.env.VITE_APP_NAME : process.env.APP_NAME;
  return json({ appName: ENVIROMENT })
}

//TRYING TO GET ACCESS TO ENV VARIABLES FROM PRODUCTION