import { useLoaderData } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import PlanCard from "./PlanCard";
import loaderPlan from "~/.server/Controller/plan/loader";
import appStyles from '~/stylesheets/plan_.new.css?url';
import planStyles from './plan.css?url';
import { LinksFunction } from "@remix-run/node";
const ROUTE_TAG = "Planes de estudio";

export default function Planes() {
  let data = useLoaderData<typeof loader>();

  let planesCards = data.planes.map((plan) => {
    return <PlanCard key={plan.id_plan_estudio} innerText={plan.nombre_plan} url={`/plan/${plan.id_plan_estudio}`} static={false} />
  })

  return (
    <div className="container-sm planContainer">
      <MainTitle innerText={ROUTE_TAG} />
      <div className="whiteContainer container">
        {planesCards}
        <PlanCard innerText="Nuevo plan" url="/plan/new" static={true} />
      </div>
    </div>
  )
}

export const loader = loaderPlan;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: planStyles },
];