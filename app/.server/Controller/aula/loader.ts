import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getAulas } from "prisma/models/aulaModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

const  loaderAula = async ({ params, request}: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId)
  if(user?.role !== "ADMIN"){
    return redirect("/")
  }
  
  const listaAulas = await getAulas();

  return json({ listaAulas: listaAulas })
}

export default loaderAula;