import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export default async function actionReport({ request, params }: ActionFunctionArgs) {
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  const isAdmin = user?.role === "ADMIN";
  const formData = await request.formData();

  if(isAdmin){
    const plan_id = String(formData.get("plan_selector"));
    const url = new URL(request.url);
    url.pathname = "/report";
    url.searchParams.set("plan_id", plan_id);
    return redirect(url.toString());   
  }else{
    return redirect("/error", 400);
  }

}