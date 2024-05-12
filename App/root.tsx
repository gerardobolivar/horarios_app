import {
  Outlet,
  Links,
  Scripts,
  Meta,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import appStyles from './old-app/Styles/app.css';
import bootstrap from "bootstrap/dist/css/bootstrap.css";
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
        <title> Sistema de Horarios</title>
        <Links />
        <Meta />
      </head>
      <body>
        <div id="root">
          <MainLayout/>
          <Outlet />
          <Scripts />
        </div>
      </body>
    </html>
  )
}