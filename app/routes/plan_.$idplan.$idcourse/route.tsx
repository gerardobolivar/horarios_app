import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation} from "@remix-run/react";
import { createCourse, getCourseById, updateCourse } from "prisma/models/courseModel";
import { useEffect, useState } from "react";

export default function ModalCourse() {
  const navigation = useNavigation()
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewCourse: boolean = data.isNewCourse;
  const course = data.course;

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
      <h2>{isNewCourse?"Agregar Curso":"Ver/Actualizar Curso"}</h2>
      <div className="body_container">
        <Form id="courseForm" method="post" autoComplete="off" preventScrollReset>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                <span>
                  <label htmlFor="course_name">Nombre</label>
                  <input
                    id="course_name"
                    title="Nombre del curso"
                    type="text"
                    name="course_name"
                    placeholder=""
                    className=""
                    required={true}
                    maxLength={150}
                    defaultValue={!isNewCourse && course ? course.nombre : ""}   
                  />
                </span>
                <span>
                  <label htmlFor="sigla">Sigla</label>
                  <input
                    id="sigla"
                    title="Sigla"
                    type="text"
                    name="sigla"
                    placeholder=""
                    className=""
                    required={true}
                    maxLength={10}
                    defaultValue={!isNewCourse && course ? course.sigla : ""}             
                  />
                </span>
                <span>
                  <label htmlFor="hora">Horas lectivas</label>
                  <input
                    id="hora"
                    title="Hora"
                    type="number"
                    name="horas"
                    placeholder=""
                    className=""
                    min={1}
                    max={8}
                    defaultValue={!isNewCourse && course ? course.horas : ""}
                    required={true}       
                  />
                </span>
                <span>
                  <label htmlFor="type" >Tipo de Curso</label>
                  <select name="tipo" id="type" defaultValue={!isNewCourse && course? course.tipoCurso : "T"} >
                    <option value="T">Teórico</option>
                    <option value="P">Práctico</option>
                    <option value="TP">Teórico-Práctico</option>
                  </select>
                </span>
                <span hidden={isNewCourse}>
                  <p><strong>Modificado:</strong>
                  {!isNewCourse && course ? ` ${getTimeStamp(course.fecha_modificado)}`: ""}
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
              value={isNewCourse ? "create" : "update"}>
              {isNewCourse ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/plan/${data.planId}`} preventScrollReset={true}>
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
  const name = String(formData.get("course_name")).toUpperCase();
  const sigla = String(formData.get("sigla")).toUpperCase();
  const idplan = Number(params.idplan);
  const horas = String(formData.get("horas"));
  const tipo = String(formData.get("tipo"));
  const intent = formData.get("intent");
  let status:number;
  
  if (intent === "create") {
    const curso = await createCourse(name, sigla, idplan, horas, tipo)
  } else {
    const idcourse = Number(params.idcourse);
    await updateCourse(idcourse, name, sigla, horas, tipo)
  }
  return redirect(`/plan/${idplan}/`,{
    headers: {
      'X-Remix-Revalidate': 'yes',
    },
  })
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const planId = params.idplan;
  const isNewCourse = params.idcourse === "new";
  const idcourse = Number(params.idcourse);
  return json({ planId: planId, isNewCourse: isNewCourse, course: isNewCourse ? null: await getCourseById(idcourse)})
}