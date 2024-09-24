import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createCourse, updateCourse } from "prisma/models/courseModel";

const actionIdplanIdCourse = async function action({ request, params }: ActionFunctionArgs){
  const formData = await request.formData();
  const name = String(formData.get("course_name")).toUpperCase();
  const sigla = String(formData.get("sigla")).toUpperCase();
  const idplan = Number(params.idplan);
  const horas = String(formData.get("horas"));
  const tipo = String(formData.get("tipo"));
  const ubicacion = formData.get("ubicacionCurso") as string;
  const intent = formData.get("intent");
  let status:number;
  
  if (intent === "create") {
    const curso = await createCourse(name, sigla, idplan, horas, tipo, ubicacion)
  } else {
    const idcourse = Number(params.idcourse);
    await updateCourse(idcourse, name, sigla, horas, tipo, ubicacion)
  }
  return redirect(`/plan/${idplan}/`,{
    headers: {
      'X-Remix-Revalidate': 'yes',
    },
  })
}

export default actionIdplanIdCourse;