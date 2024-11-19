import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getHorario } from "prisma/models/horarioModel";
import { createMatricula, removeMatricula, updateMatricula } from "prisma/models/matriculaModelo";
import { deleteTimeSpanById } from "prisma/models/timeSpanModel";
import { getUser, requireUser } from "~/.server/session";

export default async function actionHorarioIdhorarioIdmatricula({ request, params }: ActionFunctionArgs) {
  const user_id = await requireUser(request);
  const user = await getUser(request);
  const formData = await request.formData();
  const curso = Number(formData.get("cursoHorario"));
  const profesor = Number(formData.get("profesorHorario"));
  const modalidad = (formData.get("modalidadHorario")) as string;
  const timeSpans = formData.get("time_spans") as string;
  const mobileLab = Number(formData.get("movilHorario")) === 0 ? null : Number(formData.get("movilHorario"));
  const intent = formData.get("intent");
  const horarioId = Number(params.idhorario);
  const matriculaID = Number(params.idmatricula);
  const searchQueries = formData.get("filters");
  const grupo = Number(formData.get("grupo"))
  const timeSpansJson = JSON.parse(timeSpans)
  const color = String(formData.get("color"));
  const timesToRemove = formData.get("times_to_remove") as string;
  const timesToRemoveJson = JSON.parse(timesToRemove);

  const isActive = (await getHorario(horarioId))?.active;
  if(!isActive && user?.role !== "ADMIN"){return null};
  

  if (intent === "create") {
    if(timeSpansJson.length < 1){
      return null;

    }
    try {
      return await createMatricula(curso, timeSpansJson, horarioId, modalidad, profesor, grupo, color, user_id, mobileLab).then(() => {
        return redirect(`/horario/${horarioId}/${searchQueries}`)
      }).catch(e => {
        console.error(e);
        return [];
      })
    } catch (error) {
      console.error(error);
      return redirect("/error")
    }

  } else if (intent === "update") {
    if(timeSpansJson.length < 1){
      return null;
    }
    const newTimeSpansJson = timeSpansJson.filter((t:any)=>!Object.hasOwn(t,"fecha_creado"))
    await updateMatricula(newTimeSpansJson, matriculaID, profesor, color, mobileLab);
    
    if(timesToRemoveJson.length > 0){
      timesToRemoveJson.map(async (t:number)=>{
        await deleteTimeSpanById(t).catch(e=>{
          console.error(e);
        });
      })
    }

    return redirect(`/horario/${horarioId}/${searchQueries}`)
  } else if (intent == "eliminar") {
      await removeMatricula(matriculaID).catch(e => {
      console.error(e);
    });
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  }
  return null;
}