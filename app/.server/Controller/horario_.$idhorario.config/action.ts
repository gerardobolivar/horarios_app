import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { activateHorarioById, deactivateHorarioById } from "prisma/models/horarioModel";

const actionHorarioIdhorarioConfig = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const horarioId = Number(params.idhorario)

  if (intent === "archivar") {

    await deactivateHorarioById(horarioId);
    return redirect(`/horario/${horarioId}/config`)

  } else if (intent === "desarchivar") {
    await activateHorarioById(horarioId).catch(() => {
      console.error(`Schedule id=${horarioId} couldn't be actived.`)
      return redirect("/error");
    })
    return null
  } else {
    return null;
  }
}

export default actionHorarioIdhorarioConfig;