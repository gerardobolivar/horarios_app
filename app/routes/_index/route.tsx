import { json, LoaderFunctionArgs } from "@remix-run/node";
import MainTitle from "../shared/MainTitle";
import CicleCard from "./CicleCard";
import { createCicles, getCiclos } from "prisma/models/cicloModel";
import { useLoaderData } from "@remix-run/react";

export default function HomeAdmin(){
  const data = useLoaderData<typeof loader>();

  const cicleList = data.ciclos.map((c)=>{
    return <CicleCard key={c?.ciclo_id} innerText={c?.nombre} url={`/horario/${c?.horario_id}`} active={c?.active} cicloID={c?.ciclo_id}></CicleCard>
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
  if(ciclos.length < 1){
    return await createCicles().then(async ()=>{
       const createdCicles = await getCiclos().then((r)=>{return r}).catch((error)=>{return []});
       return json({ ciclos: createdCicles}); 
    }).catch((e)=>{
      console.log("Could not create cicles");
      console.error(e);
    })
  }else{
    return json({ ciclos: ciclos});
  }
};