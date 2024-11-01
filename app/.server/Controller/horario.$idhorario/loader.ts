import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getAulas } from "prisma/models/aulaModel";
import { getHorarioState } from "prisma/models/horarioModel";
import { filterMatriculas, getVirtualMatriculas } from "prisma/models/matriculaModelo";
import { getPlanes } from "prisma/models/planEstudioModel";
import { getTimesSpanBySchedule } from "prisma/models/timeSpanModel";
import { getUserById } from "prisma/models/userModel";
import { TIMES_TITLE, TIMESLOTS } from "~/.server/allowedTimes";
import { requireUser } from "~/.server/session";
import { Matricula, Planes } from "~/types/horarioTypes";

const HorarioLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const userID = await requireUser(request);
  const user = await getUserById(userID);
  const idHorario: number = Number(params.idhorario);
  const isActive = (await getHorarioState(idHorario))?.active;
  
  if(!isActive && user?.role != "ADMIN"){
    const url = new URL(request.url);
    url.pathname = "/error";
    url.searchParams.set("reason", "INACTIVE_SCHEDULE");
    return redirect(url.toString());
  }
  const url = new URL(request.url);
  const id_plan_estudioParam = url.searchParams.get("planEstudios");
  const id_plan_estudio = Number(id_plan_estudioParam) === 0 ? undefined : id_plan_estudioParam !== null ? Number(id_plan_estudioParam) : undefined;
  const dia = url.searchParams.get("dia") || "LUNES";
  const ubicacionParam = url.searchParams.get("ubicacion");
  const ubicacion = ubicacionParam === null ? undefined : (ubicacionParam != null && ubicacionParam != "0" ? ubicacionParam : undefined);
  const aulas = await getAulas();
  const timeSlots = TIMESLOTS;
  const timesTitle = TIMES_TITLE;
  const planes: Planes = await getPlanes();
  const showVirtual: Boolean = url.searchParams.get("showvirtual") === "true" ? true : false;
  const cursosVirtuales: Matricula[] = await getVirtualMatriculas(idHorario);

  const matriculas: Matricula[] = await filterMatriculas(idHorario, dia, id_plan_estudio, ubicacion).catch(e => {
    console.error(e);
    return [];
  });

  const scheduleTimeSpans = await getTimesSpanBySchedule(idHorario, dia, id_plan_estudio, ubicacion).catch(e => {
    console.error(e);
    return [];
  });


  return json({
    idHorario: idHorario,
    timesTitle: timesTitle,
    timeSlots: timeSlots,
    aulas: aulas,
    matriculas: matriculas,
    cursosVirtuales: cursosVirtuales,
    planes: planes,
    scheduleTimeSpans: scheduleTimeSpans,
    day: dia,
  });
}

export default HorarioLoader;