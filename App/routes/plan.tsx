import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react";
import MainTitle from "~/old-app/Components/MainTitle";
import PlanCard from "~/old-app/Components/PlanCard";
import { MetaFunction } from "@remix-run/node";

const tag = "Planes de estudio";

export default function Planes() {
  return (
    <div className="container-sm">
      <MainTitle innerText={tag} />
      <div className="whiteContainer container d-flex">
        <PlanCard innerText="nombre_plan" url="/plan/1" active={true} />
        <PlanCard innerText="+" url="/plan/new" active={true} />
      </div>
    </div>
  )
}

export const loader = async () => {
    return json({appName: process.env.APP_NAME}) || "Horarios";
}

export const meta: MetaFunction = () => {
  const data = useLoaderData<typeof loader>();
  return [{ title: `${data.appName} | ${tag}` }]
} 