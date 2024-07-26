import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { createMovileLab, getMovileLab, updateMobileLab } from "prisma/models/movileLab";
import { getProfesores } from "prisma/models/profesorModel";
import { useEffect, useState } from "react";

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
      <h2>Agregar laboratorio móvil</h2>
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
                    className=""
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
                    rows={4}
                    cols={50}
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
                    defaultValue={laboratory?.profesor_id} >
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
              className={btnDisabled ? "disabled" : ""}
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

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const nombre = String(formData.get("nombre_lab"));
  const detalle = String(formData.get("labDetail"));
  const profesor = Number(formData.get("profesorLab"));
  const intent = formData.get("intent");
  let status: number;

  if (intent === "create") {
    const laboratory = await createMovileLab(nombre,detalle,profesor);
  } else {
    const idlab = Number(params.idlab);
    await updateMobileLab(idlab,nombre,detalle,profesor)
  }
  return redirect(`/movil/`);
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const isNewLab: boolean = params.idlab === "new";
  const idlab: number = Number(params.idlab);
  const listaProfesores = await getProfesores()
  return json({ isNewLab: isNewLab, laboratory: isNewLab ? null : await getMovileLab(idlab), listaProfesores: listaProfesores})
}