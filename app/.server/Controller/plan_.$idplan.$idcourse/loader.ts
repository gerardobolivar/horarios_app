import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getCourseById } from "prisma/models/courseModel";

const loaderIdplanIdcourse = async ({ params }: LoaderFunctionArgs) => {
  const planId = params.idplan;
  const isNewCourse = params.idcourse === "new";
  const idcourse = Number(params.idcourse);
  return json({ planId: planId, isNewCourse: isNewCourse, course: isNewCourse ? null: await getCourseById(idcourse)})
}

export default loaderIdplanIdcourse;