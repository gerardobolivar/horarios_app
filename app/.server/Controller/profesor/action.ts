import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { removeProfesor } from "prisma/models/profesorModel";

export default async function actionProfesor({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const tokens = formData.get("intent");
  const intent = String(tokens).split("-")[0];
  const profesorID = Number(String(tokens).split("-")[1]);

  if(intent === "delete"){
    await removeProfesor(profesorID);
  }
  return redirect("/profesor")
}