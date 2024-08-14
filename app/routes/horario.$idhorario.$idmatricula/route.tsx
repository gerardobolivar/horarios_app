import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData, useLocation, useNavigation, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createMatricula, getMatriculaById, removeMatricula, updateMatricula } from "prisma/models/matriculaModelo";
import { getCourses } from "prisma/models/courseModel";
import { getProfesores } from "prisma/models/profesorModel";
import { getAulas } from "prisma/models/aulaModel";
import { getMovileLabs } from "prisma/models/movileLab";
import { Dias, Modalidad } from "@prisma/client";
import TIMESLOTS_REVERSE from "../horario.$idhorario/reversedTimes";
import { SCHEDULE_ERRORS, scheduleFilters } from "~/types/horarioTypes";

export default function HorarioModal() {
  const navigation = useNavigation();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewMatricula: boolean = data.isNewMatricula;
  const matricula = data.matricula;
  const timeSlots: string[] = Object.keys(TIMESLOTS_REVERSE)
  const location = useLocation();
  const timePicked = location.state?.timePicked;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVirtual, setIsVirtual] = useState(false);
  let [errorList,setErrorList] = useState<string[]>([]);
  const [areThereErrors, setAreThereErrors] = useState(false);

  let filters = {
    "planEstudios": (document.querySelector('select[name="planEstudios"]') as HTMLSelectElement).value,
    "dia": (document.querySelector('select[name="diaHorario"]') as HTMLSelectElement).value,
    "ubicacion": (document.querySelector('select[name="ubicacionHorario"]') as HTMLSelectElement).value
  }

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("planEstudios", `${filters.planEstudios}`);
    params.set("dia", `${filters.dia}`);
    params.set("ubicacion", `${filters.ubicacion}`);
    setSearchParams(params, { preventScrollReset: true, });
    if (data.matricula?.modalidad === "VIRTUAL") {
      setIsVirtual(true);
    }
  }, [])

  useEffect(() => {
    if (navigation.state === "submitting") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [navigation.state])

  function getTimeStamp(matricula_date: string) {
    let date = new Date(matricula_date);
    let stringDate = date.toLocaleDateString();
    let stringTime = date.toLocaleTimeString();
    return `${stringDate} a las ${stringTime}`
  }

  function handleModalidadChange(event: any) {
    const modalidad = event.currentTarget.value;
    if (modalidad === "VIRTUAL") {
      setIsVirtual(true);
      const aulaSelector = (document.getElementById("aulaHorario") as HTMLSelectElement);
      const virtualClassroomValue = ((document.getElementById("aulaHorario") as HTMLSelectElement).querySelector("option[hidden]") as HTMLOptionElement).value;
      aulaSelector.value = virtualClassroomValue;
    } else {
      (document.getElementById("aulaHorario") as HTMLSelectElement).value = "";
      setIsVirtual(false);
    }
  }

  function validateTimeSpans(): boolean {
    const initialTime = Number((document.getElementById("horaInicio") as HTMLSelectElement).value);
    const endTime = Number((document.getElementById("horaFin") as HTMLSelectElement).value)
    let approvedValidation = false;
    const hasRangeError = errorList.includes("INAVALID_TIME_RANGE");

    if (initialTime > endTime) {
      if (!hasRangeError) {
        const newList = [...errorList];
        newList.push("INAVALID_TIME_RANGE")
        setErrorList(newList)
        setAreThereErrors(true);
      }
    } else if(hasRangeError){
      const newList = errorList.filter(e=>e!=="INAVALID_TIME_RANGE")
      setErrorList(newList);
      if(newList.length < 1){setAreThereErrors(false)}
    }
     else {
      approvedValidation = true;
  
    }
    return approvedValidation;
  }

  function checkForErrors(event: any) {
    if (!validateTimeSpans()) {
      event.preventDefault();
    }
  }

  let createSearchQuery: (filters: scheduleFilters) => string = function (filters) {
    return `?planEstudios=${filters.planEstudios}&dia=${filters.dia}&ubicacion=${filters.ubicacion}`
  }

  let profesoresLista = data.listaProfesores.map((profesor) => {
    return <option value={profesor.id_profesor} key={profesor.id_profesor}>
      {`${profesor.nombre} ${profesor.primer_apellido} ${profesor.segundo_apellido}`}
    </option>
  })

  let cursosLista = data.listaCursos.map((curso) => {
    return <option value={curso.id_curso} key={curso.id_curso}>
      {`${curso.nombre}`}
    </option>
  })

  let aulasLista = data.listaAulas.map((aula) => {
    let isVirtual = aula.identificador === 999
    return <option hidden={isVirtual} value={aula.id_aula} key={aula.id_aula}>
      {`${aula.identificador < 10 ? "Aula 0" + aula.identificador : "Aula " + aula.identificador}`}
    </option>
  })

  let movilesLista = data.listaMoviles.map((movil) => {
    return <option value={movil.id_lab_mov} key={movil.id_lab_mov}>
      {`${movil.nombre}`}
    </option>
  })

  let timeList = timeSlots.map((time) => {
    return <option value={TIMESLOTS_REVERSE[time]} key={time}>
      {`${time}`}
    </option>
  })

  const renderErrors = areThereErrors ? errorList.map(e => <p key={e}>{`${SCHEDULE_ERRORS[e]}`}</p>) :null

  return <div className="overlay_styles" >
    <div className="modalContainer">
      <h2>{isNewMatricula ? "Registrar curso" : "Ver/Actualizar registro"}</h2>
      <div className="body_container">
        <Form id="courseForm"
          method="post"
          autoComplete="off"
          name="form"
          onSubmit={checkForErrors}
          preventScrollReset>
          <input hidden={true} defaultValue={createSearchQuery(filters)} name="filters"></input>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                <span>
                  <label htmlFor="cursoHorario" >Curso:</label>
                  <select
                    name="cursoHorario"
                    id="cursoHorario"
                    required={true}
                    defaultValue={matricula?.curso_id} >
                    <option value={""}></option>
                    {cursosLista}
                  </select>
                </span>

                <span>
                  <label htmlFor="profesorHorario" >Profesor:</label>
                  <select
                    name="profesorHorario"
                    id="profesorHorario"
                    required={true}
                    defaultValue={matricula?.profesor_id} >
                    <option value={""}></option>
                    {profesoresLista}
                  </select>
                </span>

                <span>
                  <label htmlFor="diaHorario" >Día:</label>
                  <select
                    name="diaHorario"
                    id="diaHorario"
                    required={true}
                    defaultValue={matricula?.dia} >
                    <option value={""}></option>
                    <option value={"LUNES"}>Lunes</option>
                    <option value={"MARTES"}>Martes</option>
                    <option value={"MIERCOLES"}>Miércoles</option>
                    <option value={"JUEVES"}>Jueves</option>
                    <option value={"VIERNES"}>Viernes</option>
                    <option value={"SABADO"}>Sábado</option>
                  </select>
                </span>
                <span>
                  <label htmlFor="modalidadHorario" >Modalidad:</label>
                  <select
                    name="modalidadHorario"
                    id="modalidadHorario"
                    required={true}
                    onChange={(e) => { handleModalidadChange(e) }}
                    defaultValue={matricula?.modalidad} >
                    <option value=""></option>
                    <option value={"PRESENCIAL"}>PRESENCIAL</option>
                    <option value={"BAJOVIRTUAL"}>BAJO VIRTUAL</option>
                    <option value={"BIMODAL"}>BIMODAL</option>
                    <option value={"ALTOVIRTUAL"}>ALTO VIRTUAL</option>
                    <option value={"VIRTUAL"}>VIRTUAL</option>
                  </select>
                </span>
                <span hidden={isVirtual}>
                  <label htmlFor="aulaHorario" >Aula:</label>
                  <select
                    name="aulaHorario"
                    id="aulaHorario"
                    required={true}
                    defaultValue={matricula?.aula_id} >
                    <option value={""}></option>
                    {aulasLista}
                  </select>
                </span>
                <span>
                  <label htmlFor="horaInicio" >Hora de inicio:</label>
                  <select
                    name="horaInicio"
                    id="horaInicio"
                    required={true}
                    onClick={validateTimeSpans}
                    defaultValue={matricula?.hora_inicio || timePicked} >
                    <option value=""></option>
                    {timeList}
                  </select>
                </span>

                <span>
                  <label htmlFor="horaFin" >Hora de finalización:</label>
                  <select
                    name="horaFin"
                    id="horaFin"
                    required={true}
                    onClick={validateTimeSpans}
                    defaultValue={(matricula ? matricula.hora_final - 1 : undefined)} >
                    <option value=""></option>
                    {timeList}
                  </select>
                </span>
                <span>
                  <label htmlFor="movilHorario" >Laboratorio móvil</label>
                  <select
                    name="movilHorario"
                    id="movilHorario"
                    defaultValue={matricula?.laboratorio_movil_id ? matricula.laboratorio_movil_id : ""} >
                    <option value={"0"}>No</option>
                    {movilesLista}
                  </select>
                </span>
                <div className="errorBlock" style={{color:"red"}}>
                  {renderErrors}
                </div>
                <span hidden={isNewMatricula}>
                  <p><strong>Modificado:</strong>
                    {!isNewMatricula && matricula ? ` ${getTimeStamp(matricula.fecha_modificado)}` : ""}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <div className="course_modal_btns">
            <button
              id="m_course_create"
              type="submit"
              className={btnDisabled || areThereErrors? "disabled" : ""}
              name="intent"
              disabled={btnDisabled || areThereErrors}
              value={isNewMatricula ? "create" : "update"}>
              {isNewMatricula ? "Guardar" : "Actualizar"}
            </button>
            <Link
              to={{
                pathname: `/horario/${data.horarioId}`,
                search: createSearchQuery(filters)
              }
              }
              preventScrollReset={true}>
              <button type="submit" className="mainButton">Cancelar</button>
            </Link>
            <button
              name="intent"
              value="eliminar"
              hidden={isNewMatricula}
              className="mainButton">Eliminar</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const curso = Number(formData.get("cursoHorario"));
  const profesor = Number(formData.get("profesorHorario"));
  const dia = formData.get("diaHorario") as Dias;
  const horaInicio = Number(formData.get("horaInicio"));
  const horaFin = Number(formData.get("horaFin")) + 1;
  const modalidad = (formData.get("modalidadHorario")) as Modalidad;
  const movilHorario = Number(formData.get("movilHorario")) === 0 ? null : Number(formData.get("movilHorario"));
  const intent = formData.get("intent");
  const aula = Number(formData.get("aulaHorario"));
  const horarioId = Number(params.idhorario);
  const matriculaID = Number(params.idmatricula)
  const searchQueries = formData.get("filters")

  if (intent === "create") {
    const matricula = await createMatricula(horaInicio, horaFin, dia, curso, aula, horarioId, profesor, modalidad, movilHorario);
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  } else if (intent === "update") {
    const matricula = await updateMatricula(matriculaID, horaInicio, horaFin, dia, curso, aula, horarioId, profesor, modalidad, movilHorario);
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  } else if (intent == "eliminar") {
    const matricula = await removeMatricula(matriculaID);
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const horarioId: number = Number(params.idhorario);
  const matriculaId: number = Number(params.idmatricula);
  const isNewMatricula: boolean = params.idmatricula === "new";
  const listaCursos = await getCourses();
  const listaProfesores = await getProfesores();
  const listaAulas = await getAulas();
  const listaMoviles = await getMovileLabs();

  return json({
    horarioId: horarioId,
    isNewMatricula: isNewMatricula,
    listaCursos: listaCursos,
    listaProfesores: listaProfesores,
    listaAulas: listaAulas,
    listaMoviles: listaMoviles,
    matricula: isNewMatricula ? null : await getMatriculaById(matriculaId)
  })
}