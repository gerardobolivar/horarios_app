import { LinksFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation, useNavigation, useSearchParams, useSubmit } from "@remix-run/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { SCHEDULE_ERRORS, scheduleFilters, TimeSpan } from "~/types/horarioTypes";
import { DIAS, SHORTEN_DAYS, TIMES } from "../horario.$idhorario/reversedTimes";
import { checkDuplicates, checkForErrors, handleModalidadChange, isAvailable, validateTimeSpans, } from "./utils";
import rstyles from "./styles.css?url"
import { useOptionalUser } from "~/utils";
import loaderHorarioIdhorarioIdmatricula from "../../.server/Controller/horario.$idhorario.$idmatricula/loader";
import actionHorarioIdhorarioIdmatricula from "~/.server/Controller/horario.$idhorario.$idmatricula/action";
import ReactTimeAgo from 'react-time-ago';


export default function HorarioModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewMatricula: boolean = data.isNewMatricula;
  const matricula = data.matricula;
  let timeSlots: string[] = data.time_white_list ? Object.keys(data.time_white_list) : [];
  const location = useLocation();
  const dia = searchParams.get("dia");
  let aula = location.state?.aulaID;
  const [isVirtual, setIsVirtual] = useState(false);
  let [errorList, setErrorList] = useState<string[]>([]);
  const [areThereErrors, setAreThereErrors] = useState(false);
  const [timeSpanList, setTimeSpanList] = useState<TimeSpan[]>(!!data.matriculaTimeSpans ? data.matriculaTimeSpans : []);
  const [warningShown, setWarningShown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const user = useOptionalUser();
  const hiddeOwnerOptions = !(user?.id_usuario === matricula?.user_id || user?.role === "ADMIN");
  const isOwner = user?.id_usuario === matricula?.user_id;
  const isAdmin = user?.role === "ADMIN";
  const [timesToRemove, setTimesToRemove] = useState<number[]>([]);
  const should_deactivate = !data.isActive && !isAdmin;
  const course_total_assiganable_hours:number = data.course_hours;
  const [course_hours, setCourse_hours] = useState(isNewMatricula? course_total_assiganable_hours: Number(matricula?.group?.Ahours))
  const [changeCourseAlarm, setChangeCourseAlarm] = useState(false);

  const [dangerSelects, setDangerSelects] = useState({
    curso:"",
    modalidad:""
  })
    

  
  useEffect(()=>{
    if(isNewMatricula){
      setCourse_hours(course_total_assiganable_hours);
    }
  },[course_total_assiganable_hours,dangerSelects])
  
  
  let filters = {
    "planEstudios": "",
    "dia": "",
    "ubicacion": "",
    "course_id": ""
  }

  try {
    filters.planEstudios = (document.querySelector('select[name="planEstudios"]') as HTMLSelectElement)?.value;
    filters.dia = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement)?.value;
    filters.ubicacion = (document.querySelector('select[name="ubicacionHorario"]') as HTMLSelectElement)?.value;
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    if (errorList.length > 0) {
      setAreThereErrors(true)
    } else {
      setAreThereErrors(false)
    }
  }, [errorList]);

  useEffect(() => {
    if (data.matricula?.modalidad === "VIRTUAL") {
      setIsVirtual(true);
    }
    const aulaCode = (document.getElementById("aulaHorario") as HTMLSelectElement)?.selectedOptions[0].innerText.split(" ")[1]

    if (aulaCode === "999") {
      try {
        (document.getElementById("modalidadHorario") as HTMLSelectElement).value = "VIRTUAL"
        setIsVirtual(true);

      } catch (error) {

      }
    }

  }, [])


  useEffect(() => {
    try {
      (document.getElementById("diaHorario") as HTMLSelectElement).value = String(dia)

    } catch (error) {
      console.log(error);

    }
  }, [dia])

  useEffect(() => {
    if (navigation.state === "submitting") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [navigation.state])

  function handleAulaChange(event: any) {
    const params = new URLSearchParams();
    const course = (document.querySelector('select[name="cursoHorario"]') as HTMLSelectElement).value;
    params.set("course", course)
    params.set("dia", `${filters.dia}`);
    params.set("aula", `${event.currentTarget.value}`)
    setSearchParams(params)

  }

  function handleDiaChange(event: any) {
    const params = new URLSearchParams();
    const selectedDay = event.currentTarget.value
    const aula = (document.querySelector('select[name="aulaHorario"]') as HTMLSelectElement).value;
    const diaFilters = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement);
    const course = (document.querySelector('select[name="cursoHorario"]') as HTMLSelectElement).value;
    filters.dia = selectedDay;
    diaFilters.value = selectedDay
    params.set("dia", `${selectedDay}`);
    params.set("aula", aula)
    params.set("course", course)
    setSearchParams(params)
  }

  function handleCuorseChange() {
    setTimeSpanList([]);
    const params = new URLSearchParams();
    const aula = (document.querySelector('select[name="aulaHorario"]') as HTMLSelectElement).value;
    const day = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value;
    const course = (document.querySelector('select[name="cursoHorario"]') as HTMLSelectElement).value;
    setDangerSelects({
      ...dangerSelects,
      curso: course,
    })
    
    params.set("dia", `${day}`);
    params.set("aula", aula)
    params.set("course", course)
    setSearchParams(params)
  }

  function addTimeSpanToList(timeSpans: TimeSpan[], timeSpan: TimeSpan) {
    const timeSPanObject: TimeSpan = {
      matricula_id: timeSpan.matricula_id,
      aula_id: isVirtual && !isNewMatricula ? Number((document.querySelector('option[hidden]') as HTMLOptionElement).value) : timeSpan.aula_id,
      dia: timeSpan.dia,
      hora_inicio: timeSpan.hora_inicio,
      hora_final: ++timeSpan.hora_final,
      type: timeSpan.type
    }
    const oldList = [...timeSpans];
    oldList.push(timeSPanObject);
    setTimeSpanList(oldList);
  }

  function handleTimeSpanAdd() {
    const timeSpan: TimeSpan = {
      aula_id: Number((document.querySelector('select[name="aulaHorario"]') as HTMLSelectElement).value),
      matricula_id: data.matricula?.matricula_id as number,
      hora_inicio: Number((document.getElementById("horaInicio") as HTMLSelectElement).value),
      hora_final: Number((document.getElementById("horaFin") as HTMLSelectElement).value),
      dia: (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value,
      type: (document.querySelector('select[name="tipoHoras"]') as HTMLSelectElement).value
    }
    const hoursToAssign = (timeSpan.hora_final-timeSpan.hora_inicio) + 1
    

    if (!checkDuplicates(timeSpanList, timeSpan) && isAvailable(timeSpanList, timeSpan) && dia && course_hours) {
      const totalHours = course_hours - hoursToAssign;
      if(totalHours >= 0){
        addTimeSpanToList(timeSpanList, timeSpan);
        setCourse_hours(totalHours);

      }
    } else {
      console.log("There are not available hours to assign.");
      
      console.log(timeSpan)
    }
  }

  function handleModalidadClick(event: FormEvent) {
    if (!warningShown && timeSpanList.length > 0) {
      setWarningShown(true);
      event.preventDefault()
      alert("Your time spans will be deleted");
    }
  }

  function handleRemoveTimeSpan(event: React.FormEvent<HTMLButtonElement>) {
    const btn = event.currentTarget as HTMLButtonElement
    if (!!btn.id) {
      if (btn.hasAttribute("value")) {
        const list = [...timesToRemove]
        list.push(Number(btn.value));
        setTimesToRemove(list);
      }
      //Calculate the time to restore (ttr)
      try {
        const timeSpanToRemove = timeSpanList.filter(t=>t.dia + t.aula_id + t.hora_inicio === btn.id)[0];
        const ttr = course_hours + ((timeSpanToRemove.hora_final - timeSpanToRemove.hora_inicio));
        setCourse_hours(ttr);
      } catch (error) {
        console.error("Could not remove time span.");
      }
      
      const newList = timeSpanList.filter(t => t.dia + t.aula_id + t.hora_inicio !== btn.id)
      setTimeSpanList(newList);
    } else {
      throw new Error(SCHEDULE_ERRORS["NULL_ID_ELEMENT"]);
    }
  }

  function addNewError(errorList: string[], newError: string) {
    const errors = [...errorList];
    errors.push(newError)
    setErrorList(errors);
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
      {`${curso.sigla} - ${curso.nombre}`}
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
  
  let timeListStart = timeSlots.map((time) => {
    return <option value={Number(time)} key={Number(time)}>
      {`${TIMES[Number(time)].split("-")[0]}`}
    </option>
  })


  let timeListEnd = timeSlots.map((time) => {
    return <option value={Number(time)} key={Number(time)}>
      {`${TIMES[Number(time)].split("-")[1]}`}
    </option>
  })

  let ownerTag = user?.role === "ADMIN" ? <p className="ownerTag">{`Dueño: ${matricula?.user.nombre_usuario}`}</p> : null

  let timeSpanListRender = timeSpanList.map((t: any) => {
    const aula = data.listaAulas.find(a => a.id_aula === t.aula_id)
    const formattedClassroom: string = Number(aula?.identificador) < 10 ? `0${aula?.identificador}` : `${aula?.identificador}`;
    return <tr key={t.dia + t.aula_id + t.hora_inicio} id={t.time_span_id}>
      <td>{` ${(matricula?.group?.completed || !isOwner) && !isNewMatricula ? DIAS[t.dia]: SHORTEN_DAYS[t.dia]}`}</td>
      <td>{formattedClassroom}</td>
      <td>{`${TIMES[t.hora_inicio].split("-")[0]} a ${TIMES[t.hora_final - 1].split("-")[1]}`}</td>
      <td hidden={matricula?.group?.completed || (!isNewMatricula && matricula?.group?.completed) || (!matricula?.group?.completed && !isNewMatricula && (!isOwner)) || (!matricula?.group?.completed && !isNewMatricula && (!isAdmin && !isOwner)) }>
        <button
          id={t.dia + t.aula_id + t.hora_inicio}
          value={t.time_span_id}
          onClick={handleRemoveTimeSpan}
          type="button"
          className="mainButton iconButton">
          <i className="bi bi-trash-fill"></i>
        </button>
      </td>
    </tr>
  })



  const renderErrors = areThereErrors ? errorList.map(e => <p className="text-danger" key={e}>{`${SCHEDULE_ERRORS[e]}`}</p>) : null;

  return <div className="overlay_styles" >
    <div className="modalContainer">
      <h2>{isNewMatricula ? "Registrar curso" : isOwner ? "Ver/Actualizar registro" : "Ver registro"}</h2>
      <div className="body_container">
        <Form id="courseForm"
          method="post"
          autoComplete="off"
          name="form"
          onSubmit={(e) => {
            checkForErrors(e, areThereErrors, formRef, timeSpanList, submit, timesToRemove)
          }}
          ref={formRef}
          preventScrollReset>
          <input hidden={true} defaultValue={createSearchQuery(filters)} name="filters"></input>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                {!isNewMatricula ? ownerTag : null}
                <div className="grid-container" style={matricula?.group?.completed || (!isNewMatricula && !isOwner) ? { display: "block" } : { display: "grid" }}>

                  <div className="section">
                    <span>
                      <label htmlFor="cursoHorario" hidden={isNewMatricula}>Curso:</label>
                      <p>{matricula?.group?.curso?.nombre}</p>
                      <select
                        style={{display: !isNewMatricula ? "none":""}}
                        name="cursoHorario"
                        id="cursoHorario"
                        required={true}
                        defaultValue={matricula ? matricula?.group?.curso.id_curso : 0}
                        hidden={hiddeOwnerOptions && !isNewMatricula}
                        className="form-select"
                        aria-label="curso_selector"
                        onMouseDown={()=>{
                          if(timeSpanList.length > 0 && !changeCourseAlarm){
                            alert("Al cambiar de curso se borrarán las franjas horarias selecciodas.");
                            setChangeCourseAlarm(true);
                          }
                        }}
                        onChange={handleCuorseChange}>
                        <option value={""}>Curso</option>
                        {cursosLista}
                      </select>
                      <div hidden={!hiddeOwnerOptions || isNewMatricula} style={{ display: "flex" }}>
                        <label style={{ marginRight: "10px" }}>Curso:</label>
                        <p>{matricula?.group?.curso.nombre}</p>
                      </div>
                    </span>

                    <span>
                      <label htmlFor="profesorHorario" hidden={true}>Profesor</label>
                      <select
                        name="profesorHorario"
                        id="profesorHorario"
                        required={true}
                        defaultValue={matricula?.group?.profesor_id}
                        hidden={hiddeOwnerOptions && !isNewMatricula}
                        className="form-select"
                        aria-label="profesor_selector">
                        <option value={""}>Profesor</option>
                        {profesoresLista}
                      </select>
                      <div hidden={!hiddeOwnerOptions || isNewMatricula} style={{ display: "flex" }}>
                        <label style={{ marginRight: "10px" }}>Profesor:</label>
                        <p>{`${matricula?.group?.profesor.nombre} ${matricula?.group?.profesor.primer_apellido} ${matricula?.group?.profesor.segundo_apellido}`}</p>
                      </div>
                    </span>
                    {
                      (matricula?.group?.completed || !isOwner) && !isNewMatricula ?
                        <span>
                          <label>Horario:</label>
                          <table>
                            <thead>
                              <tr>
                                <th>Día</th>
                                <th>Aula</th>
                                <th>Franja horaria</th>
                                <th hidden={!!matricula?.group}>Remove</th>
                              </tr>
                            </thead>
                            <tbody className="timeSpanTableEnrollment">
                              {timeSpanListRender}
                            </tbody>
                          </table>
                        </span>
                        : null
                    }

                    {hiddeOwnerOptions && !isNewMatricula ? null :
                      <span>
                        <label htmlFor="modalidadHorario" hidden={true}>Modalidad</label>
                        <select
                          name="modalidadHorario"
                          id="modalidadHorario"
                          required={true}
                          hidden={!isNewMatricula}
                          onMouseDown={handleModalidadClick}
                          onChange={(e) => { handleModalidadChange(e, setIsVirtual, setSearchParams, aula, setTimeSpanList, setDangerSelects, dangerSelects) }}
                          defaultValue={matricula ? matricula.modalidad : "PRESENCIAL"}
                          className="form-select"
                          aria-label="modalidad_selector">
                          <option value={"PRESENCIAL"}>PRESENCIAL</option>
                          <option value={"BAJOVIRTUAL"}>BAJO VIRTUAL</option>
                          <option value={"BIMODAL"}>BIMODAL</option>
                          <option value={"ALTOVIRTUAL"}>ALTO VIRTUAL</option>
                          <option value={"VIRTUAL"}>VIRTUAL</option>
                        </select>
                        <h6 hidden={isNewMatricula}>{matricula ? matricula.modalidad : null}</h6>
                      </span>
                    }
                    {hiddeOwnerOptions && !isNewMatricula ? null :
                      <span>
                        <label htmlFor="movilHorario" hidden={true}>Laboratorio móvil</label>
                        <select
                          name="movilHorario"
                          id="movilHorario"
                          defaultValue={matricula?.laboratorio_movil ? matricula.laboratorio_movil?.id_lab_mov : ""}
                          className="form-select"
                          aria-label="laboratorio_selector">
                          <option value={"0"}>Sin laboratorio móvil</option>
                          {movilesLista}
                        </select>
                      </span>
                    }
                    {hiddeOwnerOptions && !isNewMatricula ? null :
                      <span>
                        <label htmlFor="grupo">Grupo:</label>
                        <input
                          id="schedule_group_id"
                          title="Grupo"
                          type="number"
                          name="grupo"
                          placeholder=""
                          className="form-control"
                          aria-label="Grupo_input"
                          required={true}
                          readOnly={!!matricula?.group}
                          min="1"
                          max="100"
                          defaultValue={matricula?.group ? matricula?.group?.groupNumber : ""}
                        />
                      </span>
                    }
                    {hiddeOwnerOptions && !isNewMatricula ? null :
                      <span className="colorSelector">
                        <label htmlFor="color">Color:</label>
                        <input name="color"
                          type="color"
                          list="suggestedColors"
                          defaultValue={matricula ? `#${matricula.color}` : "#f0f0f0"}
                          className="form-control form-control-color" />
                        <datalist id="suggestedColors">
                          <option value="#00c0f3" />
                          <option value="#005da4" />
                          <option value="#f37021" />
                          <option value="#6dc067" />
                          <option value="#7b3400" />
                          <option value="#ffe06a" />
                        </datalist>
                      </span>
                    }
                    {hiddeOwnerOptions && !isNewMatricula ? null :
                      <span hidden={isNewMatricula}>
                        <p><strong>Modificado: </strong>
                          {!isNewMatricula && matricula ? <ReactTimeAgo date={new Date(matricula.fecha_modificado)}/>:null}
                        </p>
                      </span>
                    }
                  </div>
                  {(!matricula?.group?.completed && isOwner) || isNewMatricula ?
                    <div className="section">
                      <div hidden={hiddeOwnerOptions && !isNewMatricula}>
                        <span className="leftTimeTag">
                          {course_hours ? <p className="">{`Horas por asignar: ${course_hours}`}</p>: course_hours === 0 ? <p className="text-success">Completado</p>:"Seleccione un curso"}
                        </span>

                        <span hidden={matricula?.group?.completed}>
                          <label htmlFor="diaHorario" hidden={true}>Día</label>
                          <select
                            name="diaHorario"
                            id="diaHorario"
                            onChange={(event) => {
                              validateTimeSpans(data, filters, aula, errorList, timeSpanList, setErrorList, setAreThereErrors);
                              handleDiaChange(event);
                            }}
                            hidden={matricula?.group?.completed}
                            className="form-select"
                            aria-label="dia_selector">
                            <option value={""}>Día</option>
                            <option value={"LUNES"}>Lunes</option>
                            <option value={"MARTES"}>Martes</option>
                            <option value={"MIERCOLES"}>Miércoles</option>
                            <option value={"JUEVES"}>Jueves</option>
                            <option value={"VIERNES"}>Viernes</option>
                            <option value={"SABADO"}>Sábado</option>
                          </select>
                        </span>


                        <span hidden={isVirtual || matricula?.group?.completed}  >
                          <label htmlFor="aulaHorario" hidden={true}>Aula</label>
                          <select
                            name="aulaHorario"
                            id="aulaHorario"
                            hidden={matricula?.group?.completed}
                            onChange={(event) => {
                              validateTimeSpans(data, filters, aula, errorList, timeSpanList, setErrorList, setAreThereErrors);
                              handleAulaChange(event);
                            }}
                            defaultValue={aula}
                            className="form-select"
                            aria-label="aula_selector">
                            <option value={""}></option>
                            {aulasLista}
                          </select>
                        </span>


                        <span hidden={matricula?.group?.completed}>
                          <label htmlFor="horaInicio" hidden={true}>Hora de inicio</label>
                          <select
                            name="horaInicio"
                            id="horaInicio"
                            onChange={() => {
                              validateTimeSpans(data, filters, aula, errorList, timeSpanList, setErrorList, setAreThereErrors)
                            }}
                            hidden={matricula?.group?.completed}
                            className="form-select"
                            aria-label="hora_inicio_selector">
                            <option value="">{timeListStart.length < 1 ? "Sin espacios disponibles" : "Hora inicio"}</option>
                            {timeListStart}
                          </select>
                        </span>



                        <span hidden={matricula?.group?.completed}>
                          <label htmlFor="horaFin" hidden={true}>Hora de finalización</label>
                          <select
                            name="horaFin"
                            id="horaFin"
                            onChange={() => {
                              validateTimeSpans(data, filters, aula, errorList, timeSpanList, setErrorList, setAreThereErrors);
                            }}
                            hidden={matricula?.group?.completed}
                            className="form-select"
                            aria-label="hora_fin_selector">
                            <option value="">{timeListEnd.length < 1 ? "Sin espacios disponibles" : "Hora Fin"}</option>
                            {timeListEnd}
                          </select>
                        </span>


                        <span hidden={matricula?.group?.completed}>
                          <label htmlFor="tipoHoras" hidden={true}>Tipo:</label>
                          <select name="tipoHoras" defaultValue="T"
                            className="form-select"
                            aria-label="tipo_curso_selector">
                            <option value={""}>Tipo de curso</option>
                            <option value="T">Teórico</option>
                            <option value="P">Práctico</option>
                            <option value="TP">Teórico-Práctico</option>
                          </select>
                        </span>

                        <span hidden={!!matricula?.group?.completed}>
                          <button
                            id="addTimeSpanBtn"
                            type="button"
                            className={btnDisabled || areThereErrors ? "mainButton disabled" : "mainButton"}
                            disabled={btnDisabled || areThereErrors}
                            onClick={() => {
                              const initialTime = Number((document.getElementById("horaInicio") as HTMLSelectElement).value);
                              const endTime = Number((document.getElementById("horaFin") as HTMLSelectElement).value);
                              if (initialTime !== 0 && endTime !== 0) {
                                handleTimeSpanAdd();
                              }
                              validateTimeSpans(data, filters, aula, errorList, timeSpanList, setErrorList, setAreThereErrors);
                            }}>
                              <strong>Agregar</strong>
                            </button>
                        </span>
                        <span>
                          <label>Horario:</label>
                          <table>
                            <thead>
                              <tr>
                                <th>Día</th>
                                <th>Aula</th>
                                <th>Franja horaria</th>
                                <th hidden={!!matricula?.group}>Remove</th>
                              </tr>
                            </thead>
                            <tbody className="timeSpanTableEnrollment">
                              {timeSpanListRender}
                            </tbody>
                          </table>
                        </span>
                      </div>
                    </div>
                    : null}
                </div>
              </div>
              <div className="errorBlock">
                {renderErrors}
              </div>
            </div>
          </div>
          <div className="course_modal_btns">
            <button
              id="m_course_create"
              type="submit"
              className={!should_deactivate ? "mainButton":" mainButton disabled"}
              disabled={should_deactivate}
              name="intent"
              value={isNewMatricula ? "create" : "update"}
              hidden={hiddeOwnerOptions && !isNewMatricula}>
              {isNewMatricula ? "Guardar" : "Actualizar"}
            </button>
            <Link
              to={{
                pathname: `/horario/${data.horarioId}`,
                search: createSearchQuery(filters)
              }
              }
              preventScrollReset={true}>
              <button id="cancel_btn" type="submit" className="mainButton">&times;</button>
            </Link>
            <button
              name="intent"
              id="remove_btn"
              value="eliminar"
              hidden={isNewMatricula || hiddeOwnerOptions}
              className="mainButton">Eliminar</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
}

export const action = actionHorarioIdhorarioIdmatricula;
export const loader = loaderHorarioIdhorarioIdmatricula;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rstyles },
];