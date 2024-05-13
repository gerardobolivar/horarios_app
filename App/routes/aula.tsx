import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export default function Aula() {
  const data = useLoaderData<typeof loader>();
  let string = data.name
  let capitalizedNAme = string.charAt(0).toUpperCase() + string.slice(1);
  
  
  return (
    <div>
      <h1>Aulas</h1>
      <p>This is where you will be able to manage phisical spaces</p>
      <p>Using Pokemon API for testing</p>
      <h3>{capitalizedNAme}</h3>
      <img width="250" src={data.sprites.front_default}></img>
    </div>
  )
}
 export const loader = async () => {
   let randInt = Math.floor(Math.random()*500)+1;
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/'+randInt)
    return res.json();
  } catch (error) {
    return json({ok:false})
  }
 }