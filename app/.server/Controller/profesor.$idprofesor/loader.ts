import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getProfesor, getProfesoresByUserId } from "prisma/models/profesorModel";
import { getUser, requireUser } from "~/.server/session";

const loaderProfersorIdprofesor = async ({ params,request }: LoaderFunctionArgs) => {
  const userId = await requireUser(request)
  const user = await getUser(request);
  const isNewProfesor:boolean = params.idprofesor === "new";
  const idprofesor:number = Number(params.idprofesor);

  const profesor = isNewProfesor ? null : await getProfesor(idprofesor)
  const isAllowed = user?.role === "ADMIN" || userId === profesor?.user_id;

  if(!isAllowed ){
    return redirect("/profesor")
  }

  return json({ isNewProfesor: isNewProfesor, profesor: isNewProfesor ? null: await getProfesor(idprofesor)})
}

export default loaderProfersorIdprofesor;