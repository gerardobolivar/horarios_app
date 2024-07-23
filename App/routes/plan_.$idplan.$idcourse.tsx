import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import { createCourse, getCourseById, updateCourse } from "prisma/models/courseModel";
import { useState } from "react";

export default function ModalCourse() {
  const transition = useNavigation()
  const isCreating: any = transition.state;
  const [btnState, setBtnState] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewCourse: boolean = data.isNewCourse;
  const course = data.course;

  let [curso, setCurso] = useState({
    nombre: "",
    sigla: "",
    horas: "",
    tipoCurso: ""
  });

  function getTimeStamp(course_date:string){
    let date = new Date(course_date);
    let stringDate = date.toLocaleDateString();
    let stringTime = date.toLocaleTimeString();
    return `${stringDate} a las ${stringTime}`
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.currentTarget.value !== ""
      ? setCurso({
        ...curso, nombre: event.currentTarget.value
      })
      : setCurso(curso)

  }

  function handleAcronymChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.currentTarget.value !== ""
      ? setCurso({
        ...curso, sigla: event.currentTarget.value
      })
      : setCurso(curso)
  }

  function handleTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.currentTarget.value !== ""
      ? setCurso({
        ...curso, horas: event.currentTarget.value
      })
      : setCurso(curso)
  }

  function handleTypeChange(event: any) {
    event.currentTarget.value !== ""
      ? setCurso({
        ...curso, tipoCurso: event.currentTarget.value
      })
      : setCurso(curso);
  }

  return <div className="overlay_styles" >
    <div className="modalContainer">
      <h2>Agregar Curso</h2>
      <div className="body_container">
        <form id="courseForm" method="post" autoComplete="off">
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
                    onChange={handleNameChange}
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
                    onChange={handleAcronymChange}
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
                    onChange={handleTimeChange}
                  />
                </span>
                <span>
                  <label htmlFor="type" >Tipo de Curso</label>
                  <select name="tipo" id="type" defaultValue={!isNewCourse && course? course.tipoCurso : "T"} onChange={handleTypeChange}>
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
              className={btnState ? "disabled" : ""}
              name="intent"
              value={isNewCourse ? "create" : "update"}>
              {isNewCourse ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/plan/${data.planId}`} preventScrollReset={true}>
              <button type="submit" className="mainButton">Cancelar</button>
            </Link>
          </div>
        </form>
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
  
  console.log(`Intent: ${intent}`);
  
  if (intent === "create") {
    await createCourse(name, sigla, idplan, horas, tipo)
    return redirect(`/plan/${idplan}/`, 200);
  } else {
    const idcourse = Number(params.idcourse);
    await updateCourse(idcourse, name, sigla, horas, tipo)
    return redirect(`/plan/${idplan}/`);
  }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const planId = params.idplan;
  const isNewCourse = params.idcourse === "new";
  const idcourse = Number(params.idcourse);
  return json({ planId: planId, isNewCourse: isNewCourse, course: isNewCourse ? null: await getCourseById(idcourse)})
}