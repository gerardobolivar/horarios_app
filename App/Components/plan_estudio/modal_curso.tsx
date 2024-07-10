import { Form } from "@remix-run/react";
import { useState } from "react";

export default function ModalCourse({ state, setState }: any) {

  let [curso, setCurso] = useState({
    nombre: "",
    sigla: "",
    horas: "",
    tipoCurso: ""
  });


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

  function handleStateChange() {
    setState(false);
  }


  return <div className="overlay_styles" style={{ display: (state ? "block" : "none") }}>
    <div className="modalContainer" style={{ display: (state ? "block" : "none") }}>
      <h2>Agregar Curso</h2>
      <div className="body_container">
        <Form method="post" autoComplete="off">
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
                    min={0}
                    max={8}
                    onChange={handleTimeChange}
                  />
                </span>
                <span>
                  <label htmlFor="type" >Tipo de Curso</label>
                  <select id="type" defaultValue={"T"} onChange={handleTypeChange}>
                    <option value="T">Teórico</option>
                    <option value="P">Práctico</option>
                    <option value="TP">Teórico-Práctico</option>
                  </select>
                </span>
              </div>
            </div>
          </div>
          <div className="course_modal_btns">
            <button type="submit" name="intent" value="modal_course_create">Guardar</button>
            <button type="submit" name="intent" value="modal_cancel" onClick={handleStateChange}>Cancelar</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
}