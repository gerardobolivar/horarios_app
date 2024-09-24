import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getPlanes, getPlansByUserId } from "prisma/models/planEstudioModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";
import { Plan } from "~/types/horarioTypes";

const loaderPlan = async ({request}:LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  if(user?.role === "GUEST"){
    return redirect("/");
  }

  let planes:Plan[] = [];

  if(user?.role === "ADMIN"){
    planes = await getPlanes();
  }else if(user?.role === "USER"){
    planes = await getPlansByUserId(userId);
  }

  return json({ appName: process.env.APP_NAME || "Horarios", planes: planes });
}

export default loaderPlan;