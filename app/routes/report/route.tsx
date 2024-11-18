import { LinksFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import actionReport from "~/.server/Controller/report/action";
import loaderReport from "~/.server/Controller/report/loader";
import configPageStyles from "~/routes/cicle.$idcicle/cicleStyles.css?url";


export default function Report() {
  const data = useLoaderData<typeof loader>();
  const isAdmin = data.isAdmin;

  return (
    <div className="container main-doc" >
      <h1>{isAdmin ? "Reportes" : "Mi reporte"}</h1>
      <Form
        method="post"
        className="">
        <div>
          <button type="submit" value="reporte_personal" name="intent" className="">Crear reporte personal</button>
        </div>
        {
          isAdmin ?
            <div>
              <button value="reporte_general" name="intent" className="">Crear reporte general</button>
            </div>
            : null
        }
      </Form>
    </div>
  )
}

export const loader = loaderReport;
export const action = actionReport;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: configPageStyles },
];
