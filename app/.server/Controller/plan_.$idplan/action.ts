import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { countCoursesById, removeCourse } from "prisma/models/courseModel";
import { removePlan, updatePlan } from "prisma/models/planEstudioModel";

const actionIdplan = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = String(formData.get('nombre'));
  const intent = formData.get('intent');
  const code = String(formData.get('codigo'));

  if (intent == 'delete') {
    const coursesCount = await countCoursesById(Number(params.idplan));
    if (coursesCount.id_curso == 0) {
      await removePlan(Number(params.idplan));
      return redirect(`/plan/`)
    } else {
      let error = new Error("Plan contiene cursos")
      throw error;
    }
  }
  else if (intent == "update") {
    await updatePlan(Number(params.idplan), name, code);
    return redirect("/plan");
  }else if(String(intent).split(",")[0] === "delete_course"){
    const courseID = Number(String(intent).split(",")[1])
    if (courseID != 0) {
      try {
        await removeCourse(courseID).then();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return redirect(`/plan/${Number(params.idplan)}`)
}

export default actionIdplan;