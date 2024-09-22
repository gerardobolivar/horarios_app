import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { removeProfesor } from "prisma/models/profesorModel";

export default async function actionProfesor({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentProfesor = Number(formData.get("elementID"))

  if(intent === "delete_profesor"){
    await removeProfesor(currentProfesor);
  }
  return redirect("/profesor")
}