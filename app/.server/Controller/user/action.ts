import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { removeUsuario } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export const actionUser =  async ({ request, params }: ActionFunctionArgs) =>{
  await requireUser(request);

  const formData = await request.formData();
  const tokens = formData.get("intent");
  const intent = String(tokens).split("-")[0];
  const userID = Number(String(tokens).split("-")[1]);

  if(intent === "delete"){
    if(userID === 0){
      return null;
    }else{
      await removeUsuario(userID);
      return redirect("/user")
    }
  }else{
    return null;
  }

}