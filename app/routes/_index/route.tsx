import { json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import MainTitle from "../shared/MainTitle";
import CicleCard from "./CicleCard";
import { createCicles, getCiclos } from "prisma/models/cicloModel";
import { useLoaderData } from "@remix-run/react";
import { createActiveCycle, getActiveCycle } from "prisma/models/activeCycles";
import { createAula } from "prisma/models/aulaModel";
import indexStyles from "./indexStyles.css?url"
import { requireUser } from "~/.server/session";
import { useOptionalUser } from "~/utils";

export default function HomeAdmin(){
  const user = useOptionalUser();
  const data = useLoaderData<typeof loader>();
  const activeCycle = data.activeCycle;
  const cicleList = data.ciclos.map((c)=>{
    return <CicleCard 
              key={c?.ciclo_id}
              innerText={c?.nombre}
              url={`/horario/${c?.horario_id}`}
              active={c?.active}
              cicloID={c?.ciclo_id}
              isActiveCycle={c?.ciclo_id === activeCycle?.ciclo_id}
              isAdmin={user?.role === "ADMIN"}
              user={user}></CicleCard>
  }) 
  
return (
  <div className="">
    <MainTitle innerText="Ciclos"/>
    <div className="cicleCardContainer card p-3 bg-light border-0 mb-3">
      {cicleList}
    </div>
  </div>
)
} 

export const loader = async ({ params, request }:LoaderFunctionArgs) => {
  await requireUser(request);
  const ciclos = await getCiclos().then((r)=>{return r}).catch((error)=>{return []})

  const activeCycle = await getActiveCycle().then(r=>r,()=>null).catch((e)=>{
    console.error(e);
    return null;
  });
  
  if(ciclos.length < 1){
    return await createCicles().then(async ()=>{
       const createdCicles = await getCiclos().then(async (r)=>{
        await createActiveCycle(null).catch(e=>{
          console.error(e);
        });
        await createAula(999,50,"Espacio Virtual", "Espacio virtual").catch(e=>{
          console.error(e);
        });
        return r}).catch((error)=>{return []});
       return json({ ciclos: createdCicles, activeCycle: activeCycle}); 
    }).catch((e)=>{
      console.log("Could not create cicles");
      console.error(e);
    })
  }else{
    return json({ ciclos: ciclos, activeCycle: activeCycle});
  }
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: indexStyles },
];