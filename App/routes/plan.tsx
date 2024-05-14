import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import MainTitle from "App/old-app/Components/MainTitle";
import PlanCard from "App/old-app/Components/PlanCard";

export default function Planes(){
  const data = useLoaderData<typeof loader>();
  const tag = "Planes de estudio";

  return (
    <div className="container-sm border border-primary ">
      <MainTitle innerText={tag}/>
      <div className="whiteContainer d-flex justify-content-around">
        <PlanCard innerText="nombre_plan" url="/plan/1" active={true} />
        <PlanCard innerText="Agregar" url="/plan/edit" active={true} />

      </div>
    </div>
  )
}

export const loader = async () => {
  try {
    return json({ok: true});
  } catch (error) {
    return json({ok: false});
  }
}