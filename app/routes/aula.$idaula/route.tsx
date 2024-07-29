import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation} from "@remix-run/react";
import { createAula, getAula, updateAula } from "prisma/models/aulaModel";
import { useEffect, useState } from "react";

export default function ModalCourse() {
  const navigation = useNavigation()
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewAula: boolean = data.isNewAula;
  const aula = data.aula;

  useEffect(()=>{
    if(navigation.state === "submitting"){
      setBtnDisabled(true);
    }
  },[navigation.state])

  function getTimeStamp(aula_date:string){
    let date = new Date(aula_date);
    let stringDate = date.toLocaleDateString();
    let stringTime = date.toLocaleTimeString();
    return `${stringDate} a las ${stringTime}`
  }

  return <div className="overlay_styles" >
    <div className="modalContainer">
      <h2>Agregar aula</h2>
      <div className="body_container">
        <Form id="courseForm" method="post" autoComplete="off" preventScrollReset>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                <span>
                  <label htmlFor="ident">Identificador</label>
                  <input
                    id="identificador"
                    title="Indentifcador del aula"
                    type="text"
                    name="ident"
                    placeholder=""
                    className=""
                    required={true}
                    maxLength={45}
                    defaultValue={!isNewAula && aula ? aula.identificador : ""}   
                  />
                </span>
                <span>
                  <label htmlFor="cupo">Cupo</label>
                  <input
                    id="cupo"
                    title="Cupo"
                    type="number"
                    name="cupo"
                    placeholder=""
                    className=""
                    required={true}
                    min={1}
                    max={50}
                    defaultValue={!isNewAula && aula ? aula.cupo : ""}             
                  />
                </span>
                <span>
                <label htmlFor="detalle">Detalle</label>
                  <input
                    id="detalle"
                    title="Detalle"
                    type="text"
                    name="detalle"
                    placeholder=""
                    className=""
                    required={true}
                    maxLength={100}
                    defaultValue={!isNewAula && aula ? aula.detalle : ""}   
                  />
                </span>
                <span>
                <label htmlFor="edificio">Edificio</label>
                  <input
                    id="edificio"
                    title="Edificio"
                    type="text"
                    name="edificio"
                    placeholder=""
                    className=""
                    required={true}
                    maxLength={45}
                    defaultValue={!isNewAula && aula ? aula.edificio : ""}   
                  />
                </span>
                <span hidden={isNewAula}>
                  <p><strong>Modificado:</strong>
                  {!isNewAula && aula ? ` ${getTimeStamp(aula.fecha_modificado)}`: ""}
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
              value={isNewAula ? "create" : "update"}>
              {isNewAula ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/aula`} preventScrollReset={true}>
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
  const identificador = String(formData.get("ident")).toUpperCase();
  const detalle = String(formData.get("detalle")).toUpperCase();
  const edificio = String(formData.get("edificio")).toUpperCase();
  const cupo = Number(formData.get("cupo"))
  const intent = formData.get("intent")

  
  if (intent === "create") {
    const aula = await createAula(identificador,cupo,detalle,edificio);
  } else {
    const idaula = Number(params.idaula);
    await updateAula(idaula,identificador,cupo,detalle,edificio);
  }
  return redirect(`/aula`)
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const planId = params.idaula;
  const isNewAula = params.idaula === "new";
  const idaula = Number(params.idaula);
  return json({ planId: planId, isNewAula: isNewAula, aula: isNewAula ? null: await getAula(idaula)})
}