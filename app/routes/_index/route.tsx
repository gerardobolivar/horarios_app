import { json } from "@remix-run/node";
import MainTitle from "../shared/MainTitle";
import CicleCard from "./CicleCard";

export default function HomeAdmin(){
  //Some relevant logic in here

return (
  <div className="">
    <MainTitle innerText="Horarios"/>
    <div className="planCardContainer">
      <CicleCard innerText="Ciclo I" url="form" active={false} ></CicleCard>
      <CicleCard innerText="Ciclo II" url="/horario/2" active={true} ></CicleCard>
      <CicleCard innerText="Ciclo III" url="form" active={false} ></CicleCard>
    </div>
  </div>
)
} 

export const loader = async () => {
  return json({ ok: true });
};