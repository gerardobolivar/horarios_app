import { LinksFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation, useNavigation, useSearchParams, useSubmit } from "@remix-run/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { SCHEDULE_ERRORS, scheduleFilters, TimeSpan } from "~/types/horarioTypes";
import { DIAS, TIMES } from "../horario.$idhorario/reversedTimes";
import { checkForErrors, getTimeStamp, handleModalidadChange, validateTimeSpans, } from "./utils";
import rstyles from "./styles.css?url"
import MatriculaDetailsLoader from "../../.server/Controller/horario.$idhorario.$idmatricula/loader";
import MatriculaDetailsAction from "~/.server/Controller/horario.$idhorario.$idmatricula/action";
import { useOptionalUser } from "~/utils";

export default function HorarioModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewMatricula: boolean = data.isNewMatricula;
  const matricula = data.matricula;
  const timeSlots: string[] = data.time_white_list ? Object.keys(data.time_white_list) : [];
  const location = useLocation();
  const timePicked = location.state?.timePicked;
  const dia = searchParams.get("dia");
  let aula = location.state?.aulaID;
  const showVirtual: boolean = location.state?.showVirtual;
  const [isVirtual, setIsVirtual] = useState(false);
  let [errorList, setErrorList] = useState<string[]>([]);
  const [areThereErrors, setAreThereErrors] = useState(false);
  const [timeSpanList, setTimeSpanList] = useState<TimeSpan[]>(!!data.matriculaTimeSpans ? data.matriculaTimeSpans : []);
  const [warningShown, setWarningShown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const user = useOptionalUser();
  const hiddeOwnerOptions = !(user?.id_usuario === matricula?.user_id || user?.role === "ADMIN")


  let filters = {
    "planEstudios": "",
    "dia": "",
    "ubicacion": "",
    "show_virtual": ""
  }

  try {
    filters.planEstudios = (document.querySelector('select[name="planEstudios"]') as HTMLSelectElement).value;
    filters.dia = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value;
    filters.ubicacion = (document.querySelector('select[name="ubicacionHorario"]') as HTMLSelectElement).value;
    filters.show_virtual = (document.querySelector('input[name="show_virtual"]') as HTMLSelectElement).value
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("planEstudios", `${filters.planEstudios}`);
    params.set("dia", `${filters.dia}`);
    params.set("ubicacion", `${filters.ubicacion}`);
    params.set("aula", `${aula}`);
    params.set("showvirtual", `${showVirtual}`)

    setSearchParams(params, { preventScrollReset: true, });
    if (data.matricula?.modalidad === "VIRTUAL") {
      setIsVirtual(true);
    }
    const aulaCode = (document.getElementById("aulaHorario") as HTMLSelectElement).selectedOptions[0].innerText.split(" ")[1]

    if (aulaCode === "999") {
      (document.getElementById("modalidadHorario") as HTMLSelectElement).value = "VIRTUAL"
      setIsVirtual(true);
    }

  }, [])

  useEffect(() => {
    (document.getElementById("diaHorario") as HTMLSelectElement).value = String(dia)
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
    params.set("dia", `${filters.dia}`);
    params.set("aula", `${event.currentTarget.value}`)
    setSearchParams(params)

  }

  function handleDiaChange(event: any) {
    const params = new URLSearchParams();
    const selectedDay = event.currentTarget.value
    const aula = (document.querySelector('select[name="aulaHorario"]') as HTMLSelectElement).value;
    const diaFilters = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement);
    diaFilters.value = selectedDay
    params.set("dia", `${selectedDay}`);
    params.set("aula", aula)
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
    addTimeSpanToList(timeSpanList, timeSpan);
  }

  function handleModalidadClick(event: FormEvent) {
    if (!warningShown && timeSpanList.length > 0) {
      setWarningShown(true);
      event.preventDefault()
      alert("Your time spans will be deleted");
    }
  }

  function handleRemoveTimeSpan(event: React.FormEvent<HTMLButtonElement>) {
    const idBtn = event.currentTarget.id;
    if (!!idBtn) {
      const newList = timeSpanList.filter(t => t.dia + t.aula_id + t.hora_inicio !== idBtn)
      setTimeSpanList(newList);
    } else {
      throw new Error(SCHEDULE_ERRORS["NULL_ID_ELEMENT"]);
    }
  }

  function manageColorChange(event: React.FormEvent<HTMLInputElement>) {
    const colorInput = event.currentTarget;
    console.log(colorInput.value);

  }

  let createSearchQuery: (filters: scheduleFilters) => string = function (filters) {
    return `?planEstudios=${filters.planEstudios}&dia=${filters.dia}&ubicacion=${filters.ubicacion}&showvirtual=${filters.show_virtual}`
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

  let ownerTag = user?.role === "ADMIN" ? <p>{`Dueño: ${matricula?.user.nombre_usuario}`}</p> : null 

  let timeSpanListRender = timeSpanList.map(t => {
    const aula = data.listaAulas.find(a => a.id_aula === t.aula_id)
    const formattedClassroom: string = Number(aula?.identificador) < 10 ? `0${aula?.identificador}` : `${aula?.identificador}`;
    return <tr key={t.dia + t.aula_id + t.hora_inicio}>
      <td>{`${DIAS[t.dia]}`}</td>
      <td>{formattedClassroom}</td>
      <td>{`${TIMES[t.hora_inicio].split("-")[0]}/${TIMES[t.hora_final - 1].split("-")[1]}`}</td>
      <td hidden={!!matricula?.group}>
        <button
          id={t.dia + t.aula_id + t.hora_inicio}
          onClick={handleRemoveTimeSpan}
          type="button">
          <i className="bi bi-trash-fill"></i>
        </button>
      </td>
    </tr>
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
          onSubmit={(e) => {
            checkForErrors(e, areThereErrors, formRef, timeSpanList, submit)
          }}
          ref={formRef}
          preventScrollReset>
          <input hidden={true} defaultValue={createSearchQuery(filters)} name="filters"></input>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
                {ownerTag}
                <div className="grid-container">

                  <div className="section">
                    <span>
                      <label htmlFor="cursoHorario" >Curso:</label>
                      <select
                        name="cursoHorario"
                        id="cursoHorario"
                        required={true}
                        defaultValue={matricula?.group?.curso.id_curso} >
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
                        defaultValue={matricula?.group?.profesor_id} >
                        <option value={""}></option>
                        {profesoresLista}
                      </select>
                    </span>

                    <span>
                      <label htmlFor="modalidadHorario" >Modalidad:</label>
                      <select
                        name="modalidadHorario"
                        id="modalidadHorario"
                        required={true}
                        hidden={!isNewMatricula}
                        onMouseDown={handleModalidadClick}
                        onChange={(e) => { handleModalidadChange(e, setIsVirtual, setSearchParams, aula) }}
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

                    <span>
                      <label htmlFor="movilHorario" >Laboratorio móvil</label>
                      <select
                        name="movilHorario"
                        id="movilHorario"
                        defaultValue={matricula?.laboratorio_movil ? matricula.laboratorio_movil?.id_lab_mov : ""} >
                        <option value={"0"}>No</option>
                        {movilesLista}
                      </select>
                    </span>

                    <span>
                      <label htmlFor="grupo">Grupo</label>
                      <input
                        id="schedule_group_id"
                        title="Grupo"
                        type="number"
                        name="grupo"
                        placeholder=""
                        className=""
                        required={true}
                        readOnly={!!matricula?.group}
                        min="1"
                        max="100"
                        defaultValue={matricula?.group ? matricula?.group?.groupNumber : ""}
                      />
                    </span>
                    <span>
                      <label htmlFor="color">Color</label>
                      <input name="color" type="color" list="suggestedColors" defaultValue={matricula ? `#${matricula.color}` : "#f0f0f0"} />
                      <datalist id="suggestedColors">
                        <option value="#00c0f3" />
                        <option value="#005da4" />
                        <option value="#f37021" />
                        <option value="#6dc067" />
                        <option value="#7b3400" />
                        <option value="#ffe06a" />
                      </datalist>
                    </span>

                    <span hidden={isNewMatricula}>
                      <p><strong>Modificado:</strong>
                        {!isNewMatricula && matricula ? ` ${getTimeStamp(matricula.fecha_modificado)}` : ""}
                      </p>
                    </span>
                  </div>

                  <div className="section">

                    <div hidden={hiddeOwnerOptions}>

                      <p>{isNewMatricula ? "" : matricula?.group?.completed ? null : `Horas por asignar: ${matricula?.group?.Ahours}`}</p>
                      <span hidden={matricula?.group?.completed}>
                        <label htmlFor="diaHorario" >Día:</label>
                        <select
                          name="diaHorario"
                          id="diaHorario"
                          onChange={handleDiaChange}
                          hidden={matricula?.group?.completed}>
                          <option value={""}></option>
                          <option value={"LUNES"}>Lunes</option>
                          <option value={"MARTES"}>Martes</option>
                          <option value={"MIERCOLES"}>Miércoles</option>
                          <option value={"JUEVES"}>Jueves</option>
                          <option value={"VIERNES"}>Viernes</option>
                          <option value={"SABADO"}>Sábado</option>
                        </select>
                      </span>
                      <span hidden={isVirtual || matricula?.group?.completed}  >
                        <label htmlFor="aulaHorario" >Aula:</label>
                        <select
                          name="aulaHorario"
                          id="aulaHorario"
                          hidden={matricula?.group?.completed}
                          onChange={handleAulaChange}
                          defaultValue={aula} >
                          <option value={""}></option>
                          {aulasLista}
                        </select>

                      </span>
                      <span hidden={matricula?.group?.completed}>
                        <label htmlFor="horaInicio" >Hora de inicio:</label>
                        <select
                          name="horaInicio"
                          id="horaInicio"
                          onClick={() => {
                            validateTimeSpans(data, filters, aula, errorList, setErrorList, setAreThereErrors)
                          }}
                          hidden={matricula?.group?.completed}>
                          <option value="">{timeList.length < 1 ? "Sin espacios disponibles" : null}</option>
                          {timeList}
                        </select>
                      </span>

                      <span hidden={matricula?.group?.completed}>
                        <label htmlFor="horaFin" >Hora de finalización:</label>
                        <select
                          name="horaFin"
                          id="horaFin"
                          onClick={() => {
                            validateTimeSpans(data, filters, aula, errorList, setErrorList, setAreThereErrors)
                          }}
                          hidden={matricula?.group?.completed}>
                          <option value="">{timeList.length < 1 ? "Sin espacios disponibles" : null}</option>
                          {timeList}
                        </select>
                      </span>
                      <span hidden={matricula?.group?.completed}>
                        <label htmlFor="tipoHoras">Tipo:</label>
                        <select name="tipoHoras" defaultValue="T">
                          <option value="T">Teórico</option>
                          <option value="P">Práctico</option>
                          <option value="TP">Teórico-Práctico</option>
                        </select>
                      </span>
                      <span hidden={!!matricula?.group?.completed}>
                        <button
                          type="button"
                          onClick={handleTimeSpanAdd}
                          className="mainButton">+</button>
                      </span>

                    </div>
                    <span>
                      <table>
                        <thead>
                          <tr>
                            <th>Día</th>
                            <th>Aula</th>
                            <th>Franja horaria</th>
                            <th hidden={!!matricula?.group}>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timeSpanListRender}
                        </tbody>
                      </table>
                    </span>
                  </div>
                </div>
              </div>
              <div className="errorBlock" style={{ color: "red" }}>
                {renderErrors}
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
              value={isNewMatricula ? "create" : "update"}
              hidden={hiddeOwnerOptions}>
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
              hidden={isNewMatricula || hiddeOwnerOptions}
              className="mainButton">Eliminar</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
}


export const action = MatriculaDetailsAction;
export const loader = MatriculaDetailsLoader;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rstyles },
];

//569