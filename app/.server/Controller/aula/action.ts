import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { removeAula } from "prisma/models/aulaModel";
import { requireUser } from "~/.server/session";

export default async function actionAula({ request, params }: ActionFunctionArgs) {
  const userId = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentAula = Number(formData.get("elementID"))
  
  if(intent === "delete_aula"){
    return await removeAula(currentAula).then(()=>{
      return redirect("/aula")
    },(e)=>{
      switch (e.code) {
        case "P2003":
          console.error(`A constraint failed on in the field: ${e.meta.field_name}, in the model ${e.meta.modelName}`);
          throw redirect("/aula",405)
        default:
          return console.error(e);
      }
    })
  }
}
