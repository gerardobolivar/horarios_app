import { useLoaderData } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import PlanCard from "./PlanCard";
import loaderPlan from "~/.server/Controller/plan/loader";
const ROUTE_TAG = "Planes de estudio";

export default function Planes() {
  let data = useLoaderData<typeof loader>();

  let planesCards = data.planes.map((plan) => {
    return <PlanCard key={plan.id_plan_estudio} innerText={plan.nombre_plan} url={`/plan/${plan.id_plan_estudio}`} active={true} />
  })

  return (
    <div className="container-sm">
      <MainTitle innerText={ROUTE_TAG} />
      <div className="whiteContainer container d-flex">
        {planesCards}
        <PlanCard innerText="+" url="/plan/new" active={true} />
      </div>
    </div>
  )
}

export const loader = loaderPlan;
