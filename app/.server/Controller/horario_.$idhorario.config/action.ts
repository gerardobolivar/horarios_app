import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { activateHorarioById, countHorarioCloseTime, createHorarioCloseTime, deactivateHorarioById, deleteHorarioCloseTime } from "prisma/models/horarioModel";
import TaskMonitor from "~/.server/taskMonitor";

const actionHorarioIdhorarioConfig = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const horarioId = Number(params.idhorario)
  const dateInput = formData.get("close_sch") as string;
  const hasCloseDatime = (await countHorarioCloseTime(horarioId)) >= 1;

  if (intent === "archivar") {
    await deactivateHorarioById(horarioId);
    const myDate = new Date();
    
    if (TaskMonitor.task) {
      TaskMonitor.stopAll();
      await deleteHorarioCloseTime(horarioId).catch(e=>{
        console.error(e);})
      await createHorarioCloseTime(myDate, horarioId);
    } else {
      await createHorarioCloseTime(myDate, horarioId);
    }
    return redirect(`/horario/${horarioId}/config`)


  } else if (intent === "desarchivar") {
    await activateHorarioById(horarioId).then(async () => {
      if (hasCloseDatime) {
        await deleteHorarioCloseTime(horarioId);
      }
    }).catch((e) => {
      console.error(e);
      console.error(`Schedule id=${horarioId} couldn't be actived.`)
      return redirect("/error");
    });
    return null

  } else if (intent === "schedule") {
    const inDate = new Date(dateInput);
    const currentDate = new Date();

    if (inDate < currentDate) {
      return null;
    }

    if (dateInput && !hasCloseDatime) {
      TaskMonitor.setDeactivation(horarioId, inDate);
      await createHorarioCloseTime(inDate, horarioId);
    }
    return null;

  } else if (intent === "schedule_cancel") {
    await deleteHorarioCloseTime(horarioId);
    TaskMonitor.stopAll();
    return null;

  } else {
    return null;
  }
}

export default actionHorarioIdhorarioConfig;