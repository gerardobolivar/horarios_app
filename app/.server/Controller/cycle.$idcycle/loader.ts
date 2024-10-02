import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getActiveCycle } from "prisma/models/activeCycles";
import { getBindedHorarioByCicle, getCiclo } from "prisma/models/cicloModel";
import { getHorarios } from "prisma/models/horarioModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export const loaderCycleIdcycle = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);

  if(user?.role !== "ADMIN"){
    return redirect("/");
  }
  
  const cicloID = Number(params.idcicle)
  const ciclo = await getCiclo(cicloID).then((r) => r).catch((e) => { return null })
  const horario = await getBindedHorarioByCicle(cicloID).then(r => r).catch((e) => {
    console.error(e);
    return null;
  })

  const activeCycle = await getActiveCycle().then(r => r, () => null).catch((e) => {
    console.error(e);
    return null;
  });

  const listaHorarios = await getHorarios().then(r => r).catch((e) => {
    console.error(e);
    return null;
  })

  if (ciclo === null) {
    return redirect("/error");

  } else {
    return json({ ciclo: ciclo, horario: horario, listaHorarios: listaHorarios, activeCycle: activeCycle })
  }

}