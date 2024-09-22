import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getProfesores } from "prisma/models/profesorModel";
import { getUserById } from "prisma/models/userModel";
import { requireUser } from "~/.server/session";

const loaderProfesor = async ({ params, request}: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const user = await getUserById(userId);

  if(user?.role === "GUEST"){
    return redirect("/");
  }
  
  const listaProfesores = await getProfesores();

  return json({ listaProfesores: listaProfesores })
}

export default loaderProfesor;