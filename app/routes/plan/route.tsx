import { json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import MainTitle from "../shared/MainTitle";
import PlanCard from "./PlanCard";
import { getPlanes, getPlansByUserId } from "prisma/models/planEstudioModel";
import { requireUser } from "~/.server/session";
import { getUserById } from "prisma/models/userModel";
import { Plan } from "~/types/horarioTypes";
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

export const loader = async ({request}:LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  if(user?.role === "GUEST"){
    return redirect("/");
  }

  let planes:Plan[] = [];

  if(user?.role === "ADMIN"){
    planes = await getPlanes();
  }else if(user?.role === "USER"){
    planes = await getPlansByUserId(userId);
  }

  return json({ appName: process.env.APP_NAME || "Horarios", planes: planes });
}
