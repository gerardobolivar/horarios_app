import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react";
import MainTitle from "App/old-app/Components/MainTitle";
import PlanCard from "App/old-app/Components/PlanCard";
import ModalCard from "App/old-app/Components/ModalCard";



export default function Planes() {
  const data = useLoaderData<typeof loader>();
  const tag = "Planes de estudio";



  return (
    <div className="container-sm">
      <MainTitle innerText={tag} />
      <div className="whiteContainer container d-flex">
        <PlanCard innerText="nombre_plan" url="/plan/1" active={true}/>
        <PlanCard innerText="+" url="/plan/new" active={true} />
        <ModalCard/>
      </div>
    </div>
  )
}



export const loader = async () => {
  try {
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false });
  }
}