import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getUserById, removeUsuario } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export const actionUser =  async ({ request, params }: ActionFunctionArgs) =>{
  await requireUser(request);
  const currentUserID = await requireUser(request);
  const user = await getUserById(currentUserID);

  if(user?.role !== "ADMIN"){return null}
  

  
  const formData = await request.formData();
  const tokens = formData.get("intent");
  const intent = String(tokens).split("-")[0];
  const userID = Number(String(tokens).split("-")[1]);
  const user_to_erase = await getUserById(userID);
  
  if(!user_to_erase || user_to_erase.nombre_usuario === "ad"){return null};


  if(intent === "delete" && user_to_erase?.nombre_usuario !== "ad"){
    if(userID === 0){
      return null;
    }else{
      await removeUsuario(userID).catch(e=>{console.error(e)});
      return redirect("/user")
    }
  }else{
    return null;
  }

}