import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { clearActiveCycle } from "prisma/models/activeCycles";
import { unBindCicloByHorario } from "prisma/models/cicloModel";
import { deactivateHorarioById } from "prisma/models/horarioModel";

const actionHorarioIdhorarioConfig = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const horarioId = Number(params.idhorario)

  if (intent === "archivar") {
    return await unBindCicloByHorario(horarioId).then(async () => {
      await deactivateHorarioById(horarioId).then(async () => {
        await clearActiveCycle().catch(e => {
          console.error(e);})
      }).catch(e => {
          console.error(e);});
      return redirect(`/horario/${horarioId}/config`)
    }).catch((e) => { return redirect(`/error`) })
  } else {
    return null;
  }
}

export default actionHorarioIdhorarioConfig;