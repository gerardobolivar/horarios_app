import MainTitle from "../../Components/MainTitle"
import CicleCard from "../../Components/CicleCard";

export default function HomeAdmin(){
  //Some relevant logic in here  

return (
  <div className="">
    <MainTitle innerText="Horarios"/>
    <div className="Panel d-flex justify-content-around">
      <CicleCard innerText="Ciclo I" url="form" active={false} ></CicleCard>
      <CicleCard innerText="Ciclo II" url="horario" active={true} ></CicleCard>
      <CicleCard innerText="Ciclo III" url="form" active={false} ></CicleCard>
    </div>
  </div>
)
} 