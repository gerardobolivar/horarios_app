import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { removeUsuario } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export const actionUser =  async ({ request, params }: ActionFunctionArgs) =>{
  await requireUser(request);

  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentUsuario = Number(formData.get("elementID"))

  if(intent === "delete_usuario"){
    await removeUsuario(currentUsuario);
  }
  return redirect("/user")
}