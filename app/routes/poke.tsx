import { json, LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import appStyles from '~/stylesheets/plan_.new.css?url';


export default function Aula() {
  const data = useLoaderData<typeof loader>();
  let string = data.name
  let capitalizedNAme = string.charAt(0).toUpperCase() + string.slice(1);
  
  
  return (
    <div className="overlay_styles">
      <div style={{
        "position": "fixed",
        "transform": "translate(-50%, -50%)",
        "top": "50%",
        "left": "50%",
        "padding": "10px",
        "zIndex": "1000"  
      }}>
      <img width="400" src={data.sprites.front_default}></img>
      </div>
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

 export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles }
];