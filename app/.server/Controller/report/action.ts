import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";
import { createGeneralReport, createPersonalReport } from "./reportUtils";

export default async function actionReport({ request, params }: ActionFunctionArgs) {
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  const isAdmin = user?.role === "ADMIN";

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "reporte_general") {
    if (isAdmin) {
      createGeneralReport();
      return null;

    }

    return redirect("/error", 403);
  } else if (intent === "reporte_personal") {
    createPersonalReport();
    return null;
  }

  return redirect("/error", 400);
}