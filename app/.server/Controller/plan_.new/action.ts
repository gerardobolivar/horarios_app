import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { countPlansByUserID, createPlan } from "prisma/models/planEstudioModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

const actionplanNew = async ({ request }: ActionFunctionArgs) =>{
  const userID = await requireUser(request);
  const plansAmount = await countPlansByUserID(userID);
  const user = await getUserById(userID);
  
  if(plansAmount >= 1 && user?.role != "ADMIN"){
    const url = new URL(request.url);
    url.pathname = "/error";
    url.searchParams.set("reason", "NOT_ALLOWED_MAX_LIMIT");
    return redirect(url.toString(),);
  }

  const formData = await request.formData();
  const name = String(formData.get("nombre"));
  const code = String(formData.get("codigo"));
  const plan =  await createPlan(name,code,userID)
  const planId = plan.id_plan_estudio
  
  return redirect(`/plan/${planId}`)
}

export default actionplanNew;