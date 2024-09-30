import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getBindedHorario } from "prisma/models/cicloModel";
import { getHorario } from "prisma/models/horarioModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

const loaderHorarioIdhorarioConfig = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUser(request)
  const user = await getUserById(userId);
  if(user?.role !== "ADMIN"){
    return redirect("/");
  }

  const horarioId = Number(params.idhorario);
  const horario = await getHorario(horarioId).then((r) => { return r }, () => { return {} }).catch((e) => { console.error(e); return {} })
  const ciclo = await getBindedHorario(horarioId).then(
    (r) => r).catch((e) => {
      console.error(e)
      return null;
    })
  return json({ horarioId: horarioId, horario: horario, ciclo: ciclo })
}

export default loaderHorarioIdhorarioConfig;