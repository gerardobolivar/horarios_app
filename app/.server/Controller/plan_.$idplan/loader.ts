import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCoursesbyPlan } from "prisma/models/courseModel";
import { getPlanById } from "prisma/models/planEstudioModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export const loaderIdplan = async ({params, request}: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  if(user?.role === "GUEST"){
    return redirect("/");
  }
  
  const planid = params.idplan;
  const plan = await getPlanById(Number(planid));
  const listaCursos = await getCoursesbyPlan(Number(planid));

  if (!planid || isNaN(Number(planid))) {
    throw new Response("Not found", { status: 404 });
  }
  if (!plan) {
    throw new Response("Not found", { status: 404 });
  }
  return json({ cursos: listaCursos, plan: plan })
}

export default loaderIdplan;