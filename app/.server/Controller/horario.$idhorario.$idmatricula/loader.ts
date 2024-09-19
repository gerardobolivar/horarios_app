import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getAula, getAulas } from "prisma/models/aulaModel";
import { getCourses, getCoursesByUserId } from "prisma/models/courseModel";
import { getMatriculaById } from "prisma/models/matriculaModelo";
import { getMovileLabs } from "prisma/models/movileLab";
import { getProfesores } from "prisma/models/profesorModel";
import { getTimeSpanByMatricula, getTimeSpanSByHorarioDia } from "prisma/models/timeSpanModel";
import { getUserById } from "prisma/models/userModel";
import { TIMESLOTS } from "~/.server/allowedTimes";
import { generateTimeWhiteList } from "~/.server/Controller/Horario/horario";
import { requireUser } from "~/.server/session";
import { LockTime, TimeSpan } from "~/types/horarioTypes";

const MatriculaDetailsLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  const listaCursos = user?.role === "ADMIN" ? await getCourses() : await getCoursesByUserId(userId);
  const horarioId: number = Number(params.idhorario);
  const matriculaId: number = Number(params.idmatricula);
  const isNewMatricula: boolean = params.idmatricula === "new";
  const listaProfesores = await getProfesores();
  const listaAulas = await getAulas();
  const listaMoviles = await getMovileLabs();
  const url = new URL(request.url);
  const dia = url.searchParams.get("dia") || "LUNES";
  const aula = Number(url.searchParams.get("aula"));

  const matriculaTimeSpans: TimeSpan[] = !!matriculaId ? await getTimeSpanByMatricula(matriculaId).then(r => r).catch(e => {
    console.error(e);
    return [];
  }) : []

  let time_white_list;
  if (aula !== 0) {
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
    matricula: isNewMatricula ? null : await getMatriculaById(matriculaId)
  })
}

export default MatriculaDetailsLoader;