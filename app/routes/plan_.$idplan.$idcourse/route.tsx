import { Form, Link, useLoaderData, useNavigation} from "@remix-run/react";
import { useEffect, useState } from "react";
import actionIdplanIdCourse from "~/.server/Controller/plan_.$idplan.$idcourse/action";
import loaderIdplanIdcourse from "~/.server/Controller/plan_.$idplan.$idcourse/loader";

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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
                    min={1}
                    max={12}
                    defaultValue={!isNewCourse && course ? course.horas : ""}
                    required={true}       
                  />
                </span>
                <span>
                  <label htmlFor="ubicacionCurso" >Ubicación en el plan</label>
                  <select 
                    name="ubicacionCurso"
                    id="ubicacionCurso"
                    required={true}
                    defaultValue={course?.ubicacion}
                    className="form-control">
                    <option value={""}>Escoger</option>
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"3"}>3</option>
                    <option value={"4"}>4</option>
                    <option value={"5"}>5</option>
                  </select>
                </span>
                <span>
                  <label htmlFor="type" >Tipo de Curso</label>
                  <select name="tipo"
                    id="type"
                    defaultValue={!isNewCourse && course? course.tipoCurso : "T"} 
                    className="form-control">
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
              className={btnDisabled ? "disabled maintButton" : "mainButton"}
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

export const action = actionIdplanIdCourse;
export const loader = loaderIdplanIdcourse;