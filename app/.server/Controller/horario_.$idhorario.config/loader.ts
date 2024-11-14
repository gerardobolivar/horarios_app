import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getBindedHorario } from "prisma/models/cicloModel";
import { countHorarioCloseTime, getHorario, getHorarioCloseTimeByHorario } from "prisma/models/horarioModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";
import TaskMonitor from "~/.server/taskMonitor";

const loaderHorarioIdhorarioConfig = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  const horarioId = Number(params.idhorario)
  
  const closeDatetime = await getHorarioCloseTimeByHorario(horarioId);
  const hasCloseDatime = (await countHorarioCloseTime(horarioId)) >= 1;
  const datetime = new Date(closeDatetime?.datetime as Date);
  
  
  if(hasCloseDatime && TaskMonitor.task == null){
    TaskMonitor.setDeactivation(horarioId,datetime);
  }

  if(user?.role !== "ADMIN"){
    return redirect("/");
  }

  const horario = await getHorario(horarioId).then((r) => { return r }, () => { return {} }).catch((e) => { console.error(e); return {} })
  const ciclo = await getBindedHorario(horarioId).then(
    (r) => r).catch((e) => {
      console.error(e)
      return null;
    })
  
    const closeHorario = await getHorarioCloseTimeByHorario(horarioId);    

  return json({ horarioId: horarioId, horario: horario, ciclo: ciclo, closeHorario:closeHorario })
}

export default loaderHorarioIdhorarioConfig;