import { Outlet, Links, Scripts, Meta, json, ScrollRestoration, useRouteError, useNavigate, } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import appStyles from "./routes/shared/app.css?url";
import bootstrap from "bootstrap/dist/css/bootstrap.css?url";
import icons from "bootstrap-icons/font/bootstrap-icons.css?url";
import MainLayout from "./routes/shared/Main";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: bootstrap },
  { rel: "stylesheet", href: icons },
];

export function Layout({ children }: { children: React.ReactNode }) {
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
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <div>
    <MainLayout />
    <Outlet />
  </div>
}

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  function goBack() {
    navigate(-1);
  }
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <div>
          <h1>KABOOM 💥... You made it explode!!</h1>
          <p>This is ok, error happens sometimes.</p>
          <p>Make sure to take note about the error and send it to the dev @ geramena102@gmail.com</p>
          <br />
          <h1>Error info</h1>
          {
            `${error}`
          }
        </div>
        <br />
        <button onClick={goBack}>Go back</button>
        <Scripts />
      </body>
    </html>
  );
}