import {
  Outlet,
  Links,
  Scripts,
  Meta,
  json,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
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

export const meta: MetaFunction = ({params}) => {
  const datas = useLoaderData<typeof loader>();
  console.log(params);
  console.log(datas);
  
  let title = "asd";
  return [
    { title:  `${datas.appName} | ${title?.toUpperCase()}` }
  ];
};

export async function loader() {
  return json({appName:process.env.APP_NAME})
}