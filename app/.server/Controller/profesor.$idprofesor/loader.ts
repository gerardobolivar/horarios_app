import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getProfesor } from "prisma/models/profesorModel";

const loaderProfersorIdprofesor = async ({ params }: LoaderFunctionArgs) => {
  const isNewProfesor:boolean = params.idprofesor === "new";
  const idprofesor:number = Number(params.idprofesor);
  return json({ isNewProfesor: isNewProfesor, profesor: isNewProfesor ? null: await getProfesor(idprofesor)})
}

export default loaderProfersorIdprofesor;