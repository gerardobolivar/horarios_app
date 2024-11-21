import { ActionFunctionArgs, json, LinksFunction } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { createActiveCycle, getActiveCycle } from "prisma/models/activeCycles";
import { createAula } from "prisma/models/aulaModel";
import { createCicles, getCiclos } from "prisma/models/cicloModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";
import configPageStyles from "~/routes/cicle.$idcicle/cicleStyles.css?url";


const Configure = ()=>{
  return <div className="container main-doc">
    <p>Administration purposes only</p>
    <Form method="POST">
      <label htmlFor="configure">Trigger initial configuration:</label>
      <button id="configure" name="intent" value="configure" className="d-block">Configure</button>
    </Form>
  </div>
  
}



export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);

  if(user?.role !== "ADMIN"){return redirect("/error",403)}

  const formData = await request.formData();
  const intent = String(formData.get("intent")); 
  
  
  if(intent === "configure"){
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
    }    
  }

  return null;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: configPageStyles },
];

export default Configure;