import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createProfesor, updateProfesor } from "prisma/models/profesorModel";
import { getUser, requireUser } from "~/.server/session";

const actionProfesorIdprofesor = async ({ request, params }: ActionFunctionArgs) =>{
  const userId = await requireUser(request)
  const user = await getUser(request);
  const formData = await request.formData();
  const nombre = String(formData.get("profesor_name"));
  const primer_apellido = String(formData.get("primer_apellido"));
  const segundo_apellido = String(formData.get("segundo_apellido"));
  const email = String(formData.get("email"));
  const intent = formData.get("intent");
  let status:number;
  
  if (intent === "create") {
    const profesor = await createProfesor(nombre,primer_apellido,segundo_apellido,email, userId);
  } else {
    const idprofesor = Number(params.idprofesor);
    await updateProfesor(idprofesor,nombre,primer_apellido,segundo_apellido,email)
  }
  return redirect(`/profesor/`,{
    headers: {
      'X-Remix-Revalidate': 'yes',
    },
  })
}

export default actionProfesorIdprofesor;
