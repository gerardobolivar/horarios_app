import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData, useLocation, useNavigation, useSearchParams, useSubmit } from "@remix-run/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createMatricula, getLockedTimesByHorarioDay, getMatriculaById, removeMatricula, updateMatricula } from "prisma/models/matriculaModelo";
import { getCourses } from "prisma/models/courseModel";
import { getProfesores } from "prisma/models/profesorModel";
import { getAula, getAulas } from "prisma/models/aulaModel";
import { getMovileLabs } from "prisma/models/movileLab";
import { LockTime, SCHEDULE_ERRORS, scheduleFilters, Time_span, TimeSpan, TimeSpans } from "~/types/horarioTypes";
import { TIMESLOTS } from "~/.server/allowedTimes";
import { generateTimeWhiteList } from "~/.server/Controller/Horario/horario";
import { DIAS, TIMES } from "../horario.$idhorario/reversedTimes";
import { getTimeStamp, handleModalidadChange, validEdgeTimeSpans } from "./utils";
import { getTimeSpanByMatricula, getTimeSpanSByHorarioDia } from "prisma/models/timeSpanModel";
import rstyles from "./styles.css?url"

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
  const aula = location.state?.aula_id;
  const showVirtual: boolean = location.state?.showVirtual;
  const [isVirtual, setIsVirtual] = useState(false);
  let [errorList, setErrorList] = useState<string[]>([]);
  const [areThereErrors, setAreThereErrors] = useState(false);
  const [timeSpanList, setTimeSpanList] = useState<TimeSpan[]>(!!data.matriculaTimeSpans ? data.matriculaTimeSpans : []);
  const [warningShown, setWarningShown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();

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



  async function validateTimeSpans(): Promise<boolean> {
    const initialTime = Number((document.getElementById("horaInicio") as HTMLSelectElement).value);
    const endTime = Number((document.getElementById("horaFin") as HTMLSelectElement).value)
    const hasRangeError = errorList.includes("INAVALID_TIME_RANGE");
    const whiteListKeys = Object.keys(data.time_white_list);
    const edgesSafe = await validEdgeTimeSpans(initialTime, endTime, data.horarioId, filters.dia, aula, whiteListKeys);

    let approvedValidation = false;


    if (initialTime > endTime || !edgesSafe) {
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

  async function checkForErrors(event: React.FormEvent<HTMLFormElement>) {
    if (areThereErrors) {
      event.preventDefault();
      throw "INVALID_FORM_STATE"
    } else {
      event.preventDefault();


      if (formRef.current) {
        const formData = new FormData(formRef.current);
        formData.append("time_spans", JSON.stringify(timeSpanList));
        const submitter = (event.nativeEvent as SubmitEvent).submitter
        const intent = (submitter as HTMLButtonElement).value
        formData.append("intent", intent);
        submit(formData, { method: "POST" });
      }
    }
  }

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
      aula_id: timeSpan.aula_id,
      dia: timeSpan.dia,
      hora_inicio: timeSpan.hora_inicio,
      hora_final: ++timeSpan.hora_final
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
      dia: (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value
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

  function handleRemoveTimeSpan(event: React.FormEvent<HTMLButtonElement>){
    const idBtn = event.currentTarget.id;
    if(!!idBtn){
      const newList = timeSpanList.filter(t=> t.dia+t.aula_id+t.hora_inicio !== idBtn)
      setTimeSpanList(newList);
    }else{
      throw new Error(SCHEDULE_ERRORS["NULL_ID_ELEMENT"]);
    }
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

  let timeList = matricula ? Object.keys(TIMES).map((time) => {
    return <option value={Number(time)} key={Number(time)}>
      {`${TIMES[Number(time)]}`}
    </option>
  }) : timeSlots.map((time) => {
    return <option value={Number(time)} key={Number(time)}>
      {`${TIMES[Number(time)]}`}
    </option>
  })

  let timeSpanListRender = timeSpanList.map(t => {
    const aula = data.listaAulas.find(a => a.id_aula === t.aula_id)
    const formattedClassroom: string = Number(aula?.identificador) < 10 ? `0${aula?.identificador}` : `${aula?.identificador}`;
    return <tr key={t.dia + t.aula_id + t.hora_inicio}>
      <td>{`${DIAS[t.dia]}`}</td>
      <td>{formattedClassroom}</td>
      <td>{`${TIMES[t.hora_inicio].split("-")[0]}/${TIMES[t.hora_final - 1].split("-")[1]}`}</td>
      <td>
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
          onSubmit={checkForErrors}
          ref={formRef}
          preventScrollReset>
          <input hidden={true} defaultValue={createSearchQuery(filters)} name="filters"></input>
          <div className="outter_white_container">
            <div className="grayContainer">
              <div className="course_input_container">
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
                        defaultValue={matricula?.group ? matricula?.group?.group_id : ""}
                      />
                    </span>

                    <span hidden={isNewMatricula}>
                      <p><strong>Modificado:</strong>
                        {!isNewMatricula && matricula ? ` ${getTimeStamp(matricula.fecha_modificado)}` : ""}
                      </p>
                    </span>
                  </div>

                  <div className="section">
                    <span>
                      <label htmlFor="diaHorario" >Día:</label>
                      <select
                        name="diaHorario"
                        id="diaHorario"
                        onChange={handleDiaChange}
                        hidden={!isNewMatricula}>
                        <option value={""}></option>
                        <option value={"LUNES"}>Lunes</option>
                        <option value={"MARTES"}>Martes</option>
                        <option value={"MIERCOLES"}>Miércoles</option>
                        <option value={"JUEVES"}>Jueves</option>
                        <option value={"VIERNES"}>Viernes</option>
                        <option value={"SABADO"}>Sábado</option>
                      </select>
                    </span>
                    <span hidden={isVirtual}>
                      <label htmlFor="aulaHorario" >Aula:</label>
                      <select
                        name="aulaHorario"
                        id="aulaHorario"
                        hidden={!isNewMatricula}
                        onChange={handleAulaChange}
                        defaultValue={aula} >
                        <option value={""}></option>
                        {aulasLista}
                      </select>

                    </span>
                    <span>
                      <label htmlFor="horaInicio" >Hora de inicio:</label>
                      <select
                        name="horaInicio"
                        id="horaInicio"
                        onClick={validateTimeSpans}
                        hidden={!isNewMatricula}>
                        <option value="">{timeList.length < 1 ? "Sin espacios disponibles" : null}</option>
                        {timeList}
                      </select>
                    </span>

                    <span>
                      <label htmlFor="horaFin" >Hora de finalización:</label>
                      <select
                        name="horaFin"
                        id="horaFin"
                        onClick={validateTimeSpans}
                        hidden={!isNewMatricula}>
                        <option value="">{timeList.length < 1 ? "Sin espacios disponibles" : null}</option>
                        {timeList}
                      </select>
                    </span>
                    <span>
                      <button
                        type="button"
                        onClick={handleTimeSpanAdd}
                        className="mainButton">+</button>
                    </span>
                    <span>
                      <table>
                        <thead>
                          <tr>
                            <th>Día</th>
                            <th>Aula</th>
                            <th>Franja horaria</th>
                            <th>Remove</th>
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
  const dia = String(formData.get("diaHorario"));
  const horaInicio = Number(formData.get("horaInicio"));
  const horaFin = Number(formData.get("horaFin")) + 1;
  const modalidad = (formData.get("modalidadHorario")) as string;
  const aula = Number(formData.get("aulaHorario"));
  const timeSpans = formData.get("time_spans") as string;
  const mobileLab = Number(formData.get("movilHorario")) === 0 ? null : Number(formData.get("movilHorario"));
  const intent = formData.get("intent");
  const horarioId = Number(params.idhorario);
  const matriculaID = Number(params.idmatricula);
  const searchQueries = formData.get("filters");
  const grupo = Number(formData.get("grupo"))


  if (intent === "create") {
    try {
      const timeSpansJson = JSON.parse(timeSpans)
      return await createMatricula(curso, timeSpansJson, horarioId, modalidad, profesor, grupo, mobileLab).then(() => {
        return redirect(`/horario/${horarioId}/${searchQueries}`)
      }).catch(e => {
        console.error(e);
        return [];
      })
    } catch (error) {
      console.error(error);
      return redirect("/error")
    }


  } else if (intent === "update") {
    //await updateMatricula(matriculaID, curso, horarioId, profesor, mobileLab);
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  } else if (intent == "eliminar") {
    const matricula = await removeMatricula(matriculaID).catch(e => {
      console.error(e);
    });
    return redirect(`/horario/${horarioId}/${searchQueries}`)
  }
  return null;
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const horarioId: number = Number(params.idhorario);
  const matriculaId: number = Number(params.idmatricula);
  const isNewMatricula: boolean = params.idmatricula === "new";
  const listaCursos = await getCourses();
  const listaProfesores = await getProfesores();
  const listaAulas = await getAulas();
  const listaMoviles = await getMovileLabs();
  const url = new URL(request.url);
  const dia = url.searchParams.get("dia") || "LUNES";
  const aula = Number(url.searchParams.get("aula"));

  const matriculaTimeSpans: TimeSpan[] = !!matriculaId ? await getTimeSpanByMatricula(matriculaId).then(r => r).catch(e => {
    console.error(e);
    return [];
  }) : []

  let time_white_list;
  if (aula !== 0) {
    time_white_list = await getAula(aula).then(
      async (result) => {
        if (result?.identificador === 999) {
          return generateTimeWhiteList([], dia, aula);
        }
        else {
          const lockedTimesByHorario: LockTime[] = await getTimeSpanSByHorarioDia(horarioId, dia);
          return generateTimeWhiteList(lockedTimesByHorario, dia, aula);
        }
      },
      (e) => {
        //console.log(e);
      })
  }
  time_white_list = time_white_list === undefined ? {} : time_white_list

  return json({
    horarioId: horarioId,
    isNewMatricula: isNewMatricula,
    listaCursos: listaCursos,
    listaProfesores: listaProfesores,
    listaAulas: listaAulas,
    listaMoviles: listaMoviles,
    matriculaTimeSpans: matriculaTimeSpans,
    times: TIMESLOTS,
    time_white_list: time_white_list,
    matricula: isNewMatricula ? null : await getMatriculaById(matriculaId)
  })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rstyles },
];