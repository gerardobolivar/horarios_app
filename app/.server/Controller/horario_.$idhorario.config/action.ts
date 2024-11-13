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

    if (TaskMonitor.task) {
      TaskMonitor.stopAll();
      await deleteHorarioCloseTime(horarioId).then(async () => {
        const myDate = new Date();
        const utcDate = new Date(myDate.getTime() - myDate.getTimezoneOffset() * 60000);
        
        //const actualDate = `${myDate.getFullYear()}-${myDate.getMonth()+1 < 10 ? `0${myDate.getMonth()+1}`:myDate.getMonth()+1}-${myDate.getDate()}T${myDate.getHours()}:${myDate.getMinutes() < 10 ? `0${myDate.getMinutes()}`:myDate.getMinutes()}`
        await createHorarioCloseTime(utcDate, horarioId);
      })
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
    const utcDate = new Date(inDate.getTime() - inDate.getTimezoneOffset() * 60000);
    inDate.setUTCHours(inDate.getHours()+(360/6))
    const currentDate = new Date();
    console.log(`inDate ${inDate} < currectDate ${currentDate} = ${utcDate < currentDate}`);
    // console.log("utc_inDate: " + utcActualDate);
    console.log("getUTC hours "+`${inDate.getUTCHours()}`);
    

    if (utcDate < currentDate) {
      return null;
    }

    if (dateInput && !hasCloseDatime) {
      //const date = new Date(utcDate);
      TaskMonitor.setDeactivation(horarioId, utcDate);
      await createHorarioCloseTime(utcDate, horarioId);
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