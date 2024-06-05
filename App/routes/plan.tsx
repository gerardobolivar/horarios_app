import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react";
import MainTitle from "~/old-app/Components/MainTitle";
import PlanCard from "~/old-app/Components/PlanCard";
import { MetaFunction } from "@remix-run/node";
import { getPlanes } from "prisma/models/planEstudioModel";
const ROUTE_TAG = "Planes de estudio";

export default function Planes() {
  var METATAGDATA = useLoaderData<typeof loader>();
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

export const loader = async () => {
  const planes = await getPlanes();
  return json({ appName: process.env.APP_NAME || "Horarios", planes: planes });
}

//export const meta: MetaFunction = () => {} 