import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createMovileLab, updateMobileLab } from "prisma/models/movileLab";

const actionMobileIdlab =  async ({ request, params }: ActionFunctionArgs) =>{
  const formData = await request.formData();
  const nombre = String(formData.get("nombre_lab"));
  const detalle = String(formData.get("labDetail"));
  const profesor = Number(formData.get("profesorLab"));
  const intent = formData.get("intent");
  let status: number;

  if (intent === "create") {
    const laboratory = await createMovileLab(nombre,detalle,profesor);
  } else {
    const idlab = Number(params.idlab);
    await updateMobileLab(idlab,nombre,detalle,profesor)
  }
  return redirect(`/movil/`);
}

export default actionMobileIdlab;