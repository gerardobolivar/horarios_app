import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getMovileLab } from "prisma/models/movileLab";
import { getProfesores } from "prisma/models/profesorModel";

export const loaderMobileIdlab = async ({ params }: LoaderFunctionArgs) => {
  const isNewLab: boolean = params.idlab === "new";
  const idlab: number = Number(params.idlab);
  const listaProfesores = await getProfesores()
  return json({ isNewLab: isNewLab, laboratory: isNewLab ? null : await getMovileLab(idlab), listaProfesores: listaProfesores})
}