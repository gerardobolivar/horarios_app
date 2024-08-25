import { json, LoaderFunctionArgs } from "@remix-run/node";
import MainTitle from "../shared/MainTitle";
import CicleCard from "./CicleCard";
import { bindCicloByHorario, getCiclos } from "prisma/models/cicloModel";
import { useLoaderData } from "@remix-run/react";
import { activateHorarioById } from "prisma/models/horarioModel";

export default function HomeAdmin(){
  const data = useLoaderData<typeof loader>();

  const cicleList = data.ciclos.map((c)=>{
    return <CicleCard key={c?.ciclo_id} innerText={c?.nombre} url={`/horario/${c?.horario_id}`} active={c?.active} ></CicleCard>
  }) 
  
return (
  <div className="">
    <MainTitle innerText="Horarios"/>
    <div className="planCardContainer">
      {cicleList}
    </div>
  </div>
)
} 

export const loader = async ({ params }:LoaderFunctionArgs) => {
  const ciclos = await getCiclos().then((r)=>{return r}).catch((error)=>{return []})
  //await bindCicloByHorario(2,2).then(async ()=>{ await activateHorarioById(2);}).catch((e)=>{console.error(e);}) //Dev purposes
  return json({ ciclos: ciclos});
};