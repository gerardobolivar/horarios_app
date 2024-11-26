import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getAula, getAulas } from "prisma/models/aulaModel";
import { getCourseById, getCourses, getCoursesByUserId } from "prisma/models/courseModel";
import { getHorario } from "prisma/models/horarioModel";
import { getMatriculaById, getMatriculaModalidad } from "prisma/models/matriculaModelo";
import { getMovileLabs } from "prisma/models/movileLab";
import { getProfesores, getProfesoresByUserId } from "prisma/models/profesorModel";
import { getTimeSpanByMatricula, getTimeSpanSByHorarioDia } from "prisma/models/timeSpanModel";
import { getUserById } from "prisma/models/userModel";
import { TIMESLOTS } from "~/.server/allowedTimes";
import { generateTimeWhiteList } from "~/.server/Controller/Horario/horario";
import { requireUser } from "~/.server/session";
import { LockTime, TimeSpan } from "~/types/horarioTypes";

const loaderHorarioIdhorarioIdmatricula = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);

  const isAdmin = user?.role === "ADMIN"
  const listaCursos = isAdmin ? await getCourses() : await getCoursesByUserId(userId);
  const horarioId: number = Number(params.idhorario);
  const matriculaId: number = Number(params.idmatricula);
  const isNewMatricula: boolean = params.idmatricula === "new";
  const isActive = (await getHorario(horarioId))?.active;

  if(user?.role === "GUEST" && isNewMatricula || (!isActive && isNewMatricula && !isAdmin)){
    return redirect(`/horario/${horarioId}`)
  }

  const listaProfesores = isAdmin ? await getProfesores() : await getProfesoresByUserId(userId);
  const listaAulas = await getAulas();
  const listaMoviles = await getMovileLabs();
  const url = new URL(request.url);
  const dia = url.searchParams.get("dia") || "LUNES";
  const course_id = Number(url.searchParams.get("course"));
  const aula = Number(url.searchParams.get("aula"));
  const course_hours: number = Number((await getCourseById(course_id))?.horas)
  
  
  

  const matriculaTimeSpans: TimeSpan[] = !!matriculaId ? await getTimeSpanByMatricula(matriculaId).then(r => r).catch(e => {
    console.error(e);
    return [];
  }) : []

  let time_white_list;
  
  if(aula != 0){
    time_white_list = await getAula(aula).then(
      async (result) => {
        if (result?.identificador === 999) {
          return generateTimeWhiteList([], dia, aula);
        }
        else {

          const lockedTimesByHorario: LockTime[] = await getTimeSpanSByHorarioDia(horarioId, dia);
          return generateTimeWhiteList(lockedTimesByHorario, dia, aula);
        }
      },
      (e) => {
        console.error(e);
      })
  }else{
    if(!isNewMatricula){
      const modalidad = await getMatriculaModalidad(matriculaId);
      if(modalidad?.modalidad === "VIRTUAL"){
        time_white_list = generateTimeWhiteList([], dia, aula);
      }
    }else{
      time_white_list = null;

    }
  }
  
  time_white_list = time_white_list === undefined ? {} : time_white_list


  return json({
    horarioId: horarioId,
    isNewMatricula: isNewMatricula,
    listaCursos: listaCursos,
    listaProfesores: listaProfesores,
    listaAulas: listaAulas,
    listaMoviles: listaMoviles,
    matriculaTimeSpans: matriculaTimeSpans,
    times: TIMESLOTS,
    time_white_list: time_white_list,
    matricula: isNewMatricula ? null : await getMatriculaById(matriculaId),
    isActive: isActive,
    course_hours: course_hours
  })
}

export default loaderHorarioIdhorarioIdmatricula;