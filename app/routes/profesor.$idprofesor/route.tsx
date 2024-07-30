import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation} from "@remix-run/react";
import { createCourse, getCourseById, updateCourse } from "prisma/models/courseModel";
import { createProfesor, getProfesor } from "prisma/models/profesorModel";
import { useEffect, useState } from "react";

export default function ModalProfesor() {
  const navigation = useNavigation()
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewProfesor: boolean = data.isNewProfesor;
  const course = data.profesor;

  useEffect(()=>{
    if(navigation.state === "submitting"){
      setBtnDisabled(true);
    }
  },[navigation.state])

  function getTimeStamp(course_date:string){
    let date = new Date(course_date);
    let stringDate = date.toLocaleDateString();
    let stringTime = date.toLocaleTimeString();
    return `${stringDate} a las ${stringTime}`
  }

  return <div className="overlay_styles" >
    <div className="modalContainer">
      <h2>{isNewProfesor?"Agregar Profesor":"Ver/Actualizar Profesor"}</h2>
      <div className="body_container">
        <Form id="courseForm" method="post" autoComplete="off" preventScrollReset>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                <span>
                  <label htmlFor="profesor_name">Nombre</label>
                  <input
                    id="profesor_name"
                    title="Nombre del profesor"
                    type="text"
                    name="profesor_name"
                    placeholder=""
                    className=""
                    required={true}
                    maxLength={30}
                    defaultValue={!isNewProfesor && course ? course.nombre : ""}   
                  />
                </span>
                <span>
                  <label htmlFor="profesor_name">Primer apellido</label>
                  <input
                    id="primer_apellidos"
                    title="Primer apellido"
                    type="text"
                    name="primer_apellido"
                    placeholder=""
                    className=""
                    required={true}
                    maxLength={45}
                    defaultValue={!isNewProfesor && course ? course.primer_apellido : ""}   
                  />
                </span>
                <span>
                  <label htmlFor="profesor_name">Segundo apellido</label>
                  <input
                    id="segundo_apellidos"
                    title="Segundo apellido"
                    type="text"
                    name="segundo_apellido"
                    placeholder=""
                    className=""
                    maxLength={45}
                    defaultValue={!isNewProfesor && course ? course.segundo_apellido : ""}   
                  />
                </span>
                <span>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    title="Email"
                    type="text"
                    name="email"
                    placeholder=""
                    className=""
                    maxLength={320}
                    defaultValue={!isNewProfesor && course ? course.email : ""}   
                  />
                </span>
                <span hidden={isNewProfesor}>
                  <p><strong>Modificado:</strong>
                  {!isNewProfesor && course ? ` ${getTimeStamp(course.fecha_modificado)}`: ""}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <div className="course_modal_btns">
            <button
              id="m_course_create"
              type="submit"
              className={btnDisabled ? "disabled" : ""}
              name="intent"
              disabled={btnDisabled}
              value={isNewProfesor ? "create" : "update"}>
              {isNewProfesor ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/profesor`} preventScrollReset={true}>
              <button type="submit" className="mainButton">Cancelar</button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  </div>
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const nombre = String(formData.get("profesor_name"));
  const primer_apellido = String(formData.get("primer_apellido"));
  const segundo_apellido = String(formData.get("segundo_apellido"));
  const email = String(formData.get("email"));
  const intent = formData.get("intent");
  let status:number;
  
  if (intent === "create") {
    const profesor = await createProfesor(nombre,primer_apellido,segundo_apellido,email);
  } else {
    const idprofesor = Number(params.id_profesor);
    await updateCourse(idprofesor,nombre,primer_apellido,segundo_apellido,email)
  }
  return redirect(`/profesor/`,{
    headers: {
      'X-Remix-Revalidate': 'yes',
    },
  })
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const isNewProfesor:boolean = params.idprofesor === "new";
  const idprofesor:number = Number(params.idprofesor);
  return json({ isNewProfesor: isNewProfesor, profesor: isNewProfesor ? null: await getProfesor(idprofesor)})
}