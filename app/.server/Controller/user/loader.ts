import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserById, getUsers } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

export const loaderUser = async ({ params, request}: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);

  if(user?.role !== "ADMIN"){
    return redirect("/")
  }

  const listaUsuarios = await getUsers();

  return json({ listaUsuarios: listaUsuarios })
}
