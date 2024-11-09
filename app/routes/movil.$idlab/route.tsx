import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import actionMobileIdlab from "~/.server/Controller/movil.$idlab/action";
import { loaderMobileIdlab } from "~/.server/Controller/movil.$idlab/loader";

export default function ModalProfesor() {
  const navigation = useNavigation()
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewLab: boolean = data.isNewLab;
  const laboratory = data.laboratory;

  let profesoresLista = data.listaProfesores.map((profesor)=>{
    return <option value={profesor.id_profesor} key={profesor.id_profesor}>
      {`${profesor.nombre} ${profesor.primer_apellido} ${profesor.segundo_apellido}`}
      </option>
  })

  useEffect(() => {
    if (navigation.state === "submitting") {
      setBtnDisabled(true);
    }
  }, [navigation.state])

  function getTimeStamp(course_date: string) {
    let date = new Date(course_date);
    let stringDate = date.toLocaleDateString();
    let stringTime = date.toLocaleTimeString();
    return `${stringDate} a las ${stringTime}`
  }

  return <div className="overlay_styles" >
    <div className="modalContainer">
      <h2>{isNewLab?"Agregar laboratorio móvil":"Ver/Actualizar laboratorio móvil"}</h2>
      <div className="body_container">
        <Form id="courseForm" method="post" autoComplete="off" preventScrollReset>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                <span>
                  <label htmlFor="nombre_lab">Nombre</label>
                  <input
                    id="nombre_lab"
                    title="Nombre del laboratorio móvil"
                    type="text"
                    name="nombre_lab"
                    placeholder=""
                    className="form-control"
                    required={true}
                    maxLength={30}
                    defaultValue={!isNewLab && laboratory ? laboratory.nombre : ""}
                  />
                </span>
                <span>
                  <label htmlFor="labDetail">Detalle</label>
                  <textarea
                    id="labDetail"
                    title="Nombre del laboratorio móvil"
                    name="labDetail"
                    className="form-control"
                    rows={4}
                    cols={50}
                    maxLength={400}
                    defaultValue={laboratory?.detalle}
                    style={{
                      "resize": "none"
                    }}
                  />
                </span>
                <span>
                  <label htmlFor="profesorLab" >Profesor resposable</label>
                  <select 
                    name="profesorLab"
                    id="profesorLab"
                    required={true}
                    defaultValue={laboratory?.profesor_id} 
                    className="form-control"
                    aria-label="profesor_selector">
                    <option value={""}>Elegir profesor</option>
                    {profesoresLista}
                  </select>
                </span>
                <span hidden={isNewLab}>
                  <p><strong>Modificado:</strong>
                    {!isNewLab && laboratory ? ` ${getTimeStamp(laboratory.fecha_modificado)}` : ""}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <div className="course_modal_btns">
            <button
              id="m_course_create"
              type="submit"
              className={btnDisabled ? "disabled mainButton" : "mainButton"}
              name="intent"
              disabled={btnDisabled}
              value={isNewLab ? "create" : "update"}>
              {isNewLab ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/movil`} preventScrollReset={true}>
              <button type="submit" className="mainButton">Cancelar</button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  </div>
}

export const action = actionMobileIdlab;
export const loader = loaderMobileIdlab;