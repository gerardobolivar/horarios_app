import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { removeMobileLab } from "prisma/models/movileLab";

const actionMobile =  async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const tokens = formData.get("intent");
  const intent = String(tokens).split("-")[0];
  const labID = Number(String(tokens).split("-")[1]);

  if(intent === "delete"){
    await removeMobileLab(labID);
  }
  return redirect("/movil")
}

export default actionMobile;