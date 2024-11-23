import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getAula, removeAula } from "prisma/models/aulaModel";
import { requireUser } from "~/.server/session";

export default async function actionAula({ request, params }: ActionFunctionArgs) {
  const userId = await requireUser(request);
  const formData = await request.formData();
  const tokens = formData.get("intent");
  const intent = String(tokens).split("-")[0];
  const aulaID = Number(String(tokens).split("-")[1]);
  const aula_indentificador = Number((await getAula(aulaID))?.identificador);

  if (intent === "delete") {
    if (aula_indentificador === 999) {
      return null;
    } else {
      return await removeAula(aulaID).then(() => {
        return redirect("/aula")
      }, (e) => {
        switch (e.code) {
          case "P2003":
            console.error(`A constraint failed on in the field: ${e.meta.field_name}, in the model ${e.meta.modelName}`);
            throw redirect("/aula", 405)
          default:
            return console.error(e);
        }
      })
    }
  }

  return null;
}
