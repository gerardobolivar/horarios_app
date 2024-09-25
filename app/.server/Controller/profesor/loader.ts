import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getProfesores, getProfesoresByUserId } from "prisma/models/profesorModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

const loaderProfesor = async ({ params, request}: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);

  if(user?.role === "GUEST"){
    return redirect("/");
  }
  
  const listaProfesores = user?.role === "ADMIN" ? await getProfesores() : await getProfesoresByUserId(userId);

  return json({ listaProfesores: listaProfesores })
}

export default loaderProfesor;