import { useLoaderData } from "react-router-dom";

export default function Aula() {
  const data = useLoaderData();
  console.log(data)
  let string = data.name
  let capitalizedNAme = string.charAt(0).toUpperCase() + string.slice(1);
  return (
    <div>
      <h1>Aulas</h1>
      <p>This is where you will be able to manage phisical spaces</p>
      <p>Using Pokemon API for testing</p>
      <h3>{capitalizedNAme}</h3>
      <img width="250" src={data.sprites.back_default}></img>
    </div>
  )
}

const AulaLoader = async () => {
  //Some fetch call here...
  let randInt = Math.floor(Math.random()*500)+1;
  console.log(randInt);
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/'+randInt)
  return res
}

export {AulaLoader};