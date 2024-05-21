import { json } from "@remix-run/node";
import MainTitle from "~/old-app/Components/MainTitle";
import CicleCard from "~/old-app/Components/CicleCard";
//export {default} from "~/old-app/views/admin/home";

export default function HomeAdmin(){
  //Some relevant logic in here  

return (
  <div className="">
    <MainTitle innerText="Horarios"/>
    <div className="planCardContainer">
      <CicleCard innerText="Ciclo I" url="form" active={false} ></CicleCard>
      <CicleCard innerText="Ciclo II" url="horario" active={true} ></CicleCard>
      <CicleCard innerText="Ciclo III" url="form" active={false} ></CicleCard>
    </div>
  </div>
)
} 

export const loader = async () => {
  return json({ ok: true });
};