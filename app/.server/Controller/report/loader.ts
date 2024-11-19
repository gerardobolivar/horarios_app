import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getMatriculasByHorarioActivo, getMatriculasByHorarioActivoByPLan, getMatriculasByHorarioActivoByUserPLan } from "prisma/models/matriculaModelo";
import { getPlanById, getPlanes, getPlansByUserId } from "prisma/models/planEstudioModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";
import { Planes } from "~/types/horarioTypes";

export default async function loaderReport({params, request}:LoaderFunctionArgs){
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  const isAdmin = user?.role === "ADMIN"
  const url = new URL(request.url);
  const plan_id = Number(url.searchParams.get("plan_id"));
  const username = user?.nombre_usuario;
  
  
  if(isAdmin){
    const planes: Planes = await getPlanes();
    if(plan_id === 0){
      const matriculas = await getMatriculasByHorarioActivo();
      return json({isAdmin:isAdmin, planes: planes, matriculas: matriculas,plan_id: plan_id, username:username, plan_name:"GENERAL"})
    }else{
      
      const matriculas = await getMatriculasByHorarioActivoByPLan(plan_id);
      const plan_name = (await getPlanById(plan_id))?.nombre_plan
      return json({isAdmin:isAdmin, planes: planes, matriculas: matriculas, plan_id: plan_id, username:username, plan_name:plan_name})
    }

  }else{
    const matriculas = await getMatriculasByHorarioActivoByUserPLan(userId);
    /* At this moment users can only have one plan. If this changes in the future
    *  a selector must be habilitaded in the UI so the user can choose which plan to choose from.
    *
    */
    const plan_name = (await getPlansByUserId(userId))[0].nombre_plan;
    return json({isAdmin:isAdmin, planes: null, matriculas: matriculas, plan_id: null,username:username, plan_name:plan_name})

  }
}