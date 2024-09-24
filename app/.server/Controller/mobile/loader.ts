import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getMovileLabs } from "prisma/models/movileLab";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export const loaderMobile = async ({ params, request}: LoaderFunctionArgs) => {
  const listaMovileLabs = await getMovileLabs();
  const userId = await requireUser(request);
  const user = await getUserById(userId);
  if(user?.role !== "ADMIN"){
    return redirect("/");
  }
  
  return json({ listaMovileLabs: listaMovileLabs })
}