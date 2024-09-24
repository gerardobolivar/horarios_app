import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { removeMobileLab } from "prisma/models/movileLab";

const actionMobile =  async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const currentLab = Number(formData.get("elementID"))

  if(intent === "delete_laboratorio"){
    await removeMobileLab(currentLab);
  }
  return redirect("/movil")
}

export default actionMobile;