import { json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import MainTitle from "../shared/MainTitle";
import CicleCard from "./CicleCard";
import { getCiclos } from "prisma/models/cicloModel";
import { useLoaderData } from "@remix-run/react";
import { getActiveCycle } from "prisma/models/activeCycles";
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


  return json({ ciclos: ciclos, activeCycle: activeCycle});
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: indexStyles },
];