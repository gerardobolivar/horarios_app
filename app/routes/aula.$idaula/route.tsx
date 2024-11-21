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
  const should_block = aula?.identificador === 999

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
    <div className="modalContainer modalContainer-small">
      <h2>{isNewAula?"Agregar aula":`Aula ${Number(aula?.identificador) < 10 ? "0"+aula?.identificador:
                                    aula?.identificador === 999 ? "Virtual":
                                    aula?.identificador}`}</h2>
      <div className="body_container">
        <Form id="courseForm" method="post" autoComplete="off" preventScrollReset>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                <span>
                  <label htmlFor="ident">Número</label>
                  <input
                    id="identificador"
                    title="Indentifcador del aula"
                    type="number"
                    name="ident"
                    placeholder=""
                    className="form-control"
                    aria-label="numero_aula_input"
                    required={true}
                    min="1"
                    max="999"
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
                    className="form-control"
                    aria-label="cupo_input"
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
                    className="form-control"
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
                    className="form-control"
                    required={true}
                    maxLength={45}
                    defaultValue={!isNewAula && aula ? aula.edificio : ""}   
                  />
                </span>
                <span hidden={isNewAula || should_block}>
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
              className={btnDisabled || should_block? "disabled mainButton" : "mainButton"}
              name="intent"
              disabled={btnDisabled || should_block}
              value={isNewAula ? "create" : "update"}>
              {isNewAula ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/aula`} preventScrollReset={true}>
              <button type="submit" className="mainButton cancel_btn">&times;</button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  </div>
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const identificador = Number(formData.get("ident"));
  const detalle = String(formData.get("detalle")).toUpperCase();
  const edificio = String(formData.get("edificio")).toUpperCase();
  const cupo = Number(formData.get("cupo"))
  const intent = formData.get("intent")

  if(identificador === 999){return null}

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