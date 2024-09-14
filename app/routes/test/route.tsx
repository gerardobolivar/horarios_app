import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useMatches } from "@remix-run/react";
import { filterMatriculas, getMatriculaById, getVirtualMatriculas } from "prisma/models/matriculaModelo";
import { getTimesSpanBySchedule } from "prisma/models/timeSpanModel";

export default function test(){
  const data = useLoaderData<typeof loader>();
  //console.log(data.content);

  const routes = useMatches();
  //console.log(routes[0].data);//Root route loader data
  
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const matricula = await getVirtualMatriculas(3).catch(e=>{
    console.error(e);
    return null
  });

  const scheduleTimeSpans = await getTimesSpanBySchedule(3).catch(e=>{
    console.error(e);
    return null;
  });
  
  const matriculas = await filterMatriculas(3, "LUNES", 1, "4")

  const matr = await getMatriculaById(5);
  
  return json({content: matr})
}
