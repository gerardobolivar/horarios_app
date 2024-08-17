import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData, useLocation, useNavigation, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createMatricula, getLockedTimesByHorarioDay, getMatriculaById, removeMatricula, updateMatricula } from "prisma/models/matriculaModelo";
import { getCourses } from "prisma/models/courseModel";
import { getProfesores } from "prisma/models/profesorModel";
import { getAula, getAulas } from "prisma/models/aulaModel";
import { getMovileLabs } from "prisma/models/movileLab";
import { Dias, Modalidad } from "@prisma/client";
import { LockTime, SCHEDULE_ERRORS, scheduleFilters } from "~/types/horarioTypes";
import { TIMESLOTS } from "~/.server/allowedTimes";
import { generateTimeWhiteList } from "~/.server/Controller/Horario/horario";
import { TIMES } from "../horario.$idhorario/reversedTimes";

export default function HorarioModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const navigation = useNavigation();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewMatricula: boolean = data.isNewMatricula;
  const matricula = data.matricula;
  const timeSlots: string[] = Object.keys(data.time_white_list)
  const location = useLocation();
  const timePicked = location.state?.timePicked;
  const dia = searchParams.get("dia");
  const aula = location.state?.aula_id;
  
  const [isVirtual, setIsVirtual] = useState(false);
  let [errorList, setErrorList] = useState<string[]>([]);
  const [areThereErrors, setAreThereErrors] = useState(false);
  
  let filters = {
    "planEstudios": (document.querySelector('select[name="planEstudios"]') as HTMLSelectElement).value,
    "dia": (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value,
    "ubicacion": (document.querySelector('select[name="ubicacionHorario"]') as HTMLSelectElement).value,
  }
  
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("planEstudios", `${filters.planEstudios}`);
    params.set("dia", `${filters.dia}`);
    params.set("ubicacion", `${filters.ubicacion}`);
    params.set("aula", `${aula}`);

    setSearchParams(params, { preventScrollReset: true, });
    if (data.matricula?.modalidad === "VIRTUAL") {
      setIsVirtual(true);
    }
    const aulaCode = (document.getElementById("aulaHorario") as HTMLSelectElement).selectedOptions[0].innerText.split(" ")[1]
    
    if(aulaCode === "999"){
      (document.getElementById("modalidadHorario") as HTMLSelectElement).value = "VIRTUAL"
      setIsVirtual(true);
    }
    
  }, [])

  useEffect(()=>{
    (document.getElementById("diaHorario") as HTMLSelectElement).value = String(dia)
  },[dia])

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
    const aulaSelector = (document.getElementById("aulaHorario") as HTMLSelectElement);
    const virtualClassroomValue = ((document.getElementById("aulaHorario") as HTMLSelectElement).querySelector("option[hidden]") as HTMLOptionElement).value;
    const diaFilters = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value;
    const diaForm = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement);
    diaForm.value =  diaFilters

    if (modalidad === "VIRTUAL") {
      setIsVirtual(true);
      aulaSelector.value = virtualClassroomValue;
      const params = new URLSearchParams();
      params.set("aula", `${aula}`);
      params.set("dia", `${diaFilters}`);
      setSearchParams(params)
    } else {
      aulaSelector.value = ""
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
    } else if (hasRangeError) {
      const newList = errorList.filter(e => e !== "INAVALID_TIME_RANGE")
      setErrorList(newList);
      if (newList.length < 1) { setAreThereErrors(false) }
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

  function handleAulaChange(event:any){
    const params = new URLSearchParams();
    params.set("dia", `${filters.dia}`);
    params.set("aula", `${event.currentTarget.value}`)
    setSearchParams(params)
    
  }

  function handleDiaChange(event:any){
    const params = new URLSearchParams();
    const selectedDay = event.currentTarget.value
    const aula = (document.querySelector('select[name="aulaHorario"]') as HTMLSelectElement).value;
    const diaFilters = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement);
    diaFilters.value = selectedDay 
    params.set("dia", `${selectedDay}`);
    params.set("aula",aula)
    setSearchParams(params)
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
    
     return <option value={Number(time)} key={Number(time)}>
    {`${TIMES[Number(time)]}`}
  </option>

  })

  const renderErrors = areThereErrors ? errorList.map(e => <p key={e}>{`${SCHEDULE_ERRORS[e]}`}</p>) : null;

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
                    onChange={handleDiaChange}
                    hidden={!isNewMatricula}
                    defaultValue={matricula?.dia}>
                    <option value={""}></option>
                    <option value={"LUNES"}>Lunes</option>
                    <option value={"MARTES"}>Martes</option>
                    <option value={"MIERCOLES"}>Miércoles</option>
                    <option value={"JUEVES"}>Jueves</option>
                    <option value={"VIERNES"}>Viernes</option>
                    <option value={"SABADO"}>Sábado</option>
                  </select>
                  <h6 hidden={isNewMatricula}>{matricula ? matricula.dia : null}</h6>
                </span>
                <span>
                  <label htmlFor="modalidadHorario" >Modalidad:</label>
                  <select
                    name="modalidadHorario"
                    id="modalidadHorario"
                    required={true}
                    hidden={!isNewMatricula}
                    onChange={(e) => { handleModalidadChange(e) }}
                    defaultValue={matricula ? matricula.modalidad : "PRESENCIAL"} >
                    <option value=""></option>
                    <option value={"PRESENCIAL"}>PRESENCIAL</option>
                    <option value={"BAJOVIRTUAL"}>BAJO VIRTUAL</option>
                    <option value={"BIMODAL"}>BIMODAL</option>
                    <option value={"ALTOVIRTUAL"}>ALTO VIRTUAL</option>
                    <option value={"VIRTUAL"}>VIRTUAL</option>
                  </select>
                  <h6 hidden={isNewMatricula}>{matricula ? matricula.modalidad : null}</h6>
                </span>
                <span hidden={isVirtual}>
                  <label htmlFor="aulaHorario" >Aula:</label>
                  <select
                    name="aulaHorario"
                    id="aulaHorario"
                    required={true}
                    hidden={!isNewMatricula}
                    onChange={handleAulaChange}
                    defaultValue={matricula ? matricula?.aula_id : aula} >
                    <option value={""}></option>
                    {aulasLista}
                  </select>
                  <h6 hidden={isNewMatricula}>{matricula ?
                    `${matricula.aula_id < 10 ? "Aula 0" + matricula.aula_id : matricula.aula_id === 999 ? "Virtual" : "Aula " + matricula.aula_id}`
                    : null}</h6>
                </span>
                <span>
                  <label htmlFor="horaInicio" >Hora de inicio:</label>
                  <select
                    name="horaInicio"
                    id="horaInicio"
                    required={true}
                    onClick={validateTimeSpans}
                    hidden={!isNewMatricula}
                    defaultValue={matricula ? matricula?.hora_inicio : timePicked}>
                    <option value="">{timeList.length < 1 ? "Sin espacios disponibles":null}</option>
                    {timeList}
                  </select>
                  <h6 hidden={isNewMatricula}>{matricula ? data.times[matricula.hora_inicio] : null}</h6>

                </span>

                <span>
                  <label htmlFor="horaFin" >Hora de finalización:</label>
                  <select
                    name="horaFin"
                    id="horaFin"
                    required={true}
                    onClick={validateTimeSpans}
                    hidden={!isNewMatricula}
                    defaultValue={(matricula ? matricula.hora_final - 1 : undefined)} >
                    <option value="">{timeList.length < 1 ? "Sin espacios disponibles":null}</option>
                    {timeList}
                  </select>
                  <h6 hidden={isNewMatricula}>{matricula ? data.times[matricula.hora_final-1] : null}</h6>
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
                <div className="errorBlock" style={{ color: "red" }}>
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
              className={btnDisabled || areThereErrors ? "disabled" : ""}
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
  
  //const availableTimesDay = getAvailableTimePerDay(); 
  
  

  if (intent === "create") {
    await createMatricula(horaInicio, horaFin, dia, curso, aula, horarioId, profesor, modalidad, movilHorario)
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  } else if (intent === "update") {
    await updateMatricula(matriculaID, curso, horarioId, profesor, movilHorario);
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  } else if (intent == "eliminar") {
    const matricula = await removeMatricula(matriculaID);
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  }
}

export const loader = async ({ params,request }: LoaderFunctionArgs) => {
  const horarioId: number = Number(params.idhorario);
  const matriculaId: number = Number(params.idmatricula);
  const isNewMatricula: boolean = params.idmatricula === "new";
  const listaCursos = await getCourses();
  const listaProfesores = await getProfesores();
  const listaAulas = await getAulas();
  const listaMoviles = await getMovileLabs();
  
  const url = new URL(request.url);
  const dia = url.searchParams.get("dia") as Dias || "LUNES";
  const aula = Number(url.searchParams.get("aula")) || 999;
  console.log(aula);
  
  const time_white_list = await getAula(aula).then(
    async (result)=>{
      if(result?.identificador === 999){
        return TIMES;
      }
      else{
        const lockedTimesByHorario:LockTime[] = await getLockedTimesByHorarioDay(horarioId,dia);
        return generateTimeWhiteList(lockedTimesByHorario,dia,aula);
      }
    },
    ()=>{})

  // const lockedTimesByHorario:LockTime[] = await getLockedTimesByHorarioDay(horarioId,dia);
  // const time_white_list = generateTimeWhiteList(lockedTimesByHorario, dia, aula);
  return json({
    horarioId: horarioId,
    isNewMatricula: isNewMatricula,
    listaCursos: listaCursos,
    listaProfesores: listaProfesores,
    listaAulas: listaAulas,
    listaMoviles: listaMoviles,
    times: TIMESLOTS,
    time_white_list: time_white_list,
    matricula: isNewMatricula ? null : await getMatriculaById(matriculaId)
  })
}