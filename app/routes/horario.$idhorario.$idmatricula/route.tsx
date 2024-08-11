import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData, useLocation, useNavigation, useSearchParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createMatricula, getMatriculaById, updateMatricula } from "prisma/models/matriculaModelo";
import { getCourses } from "prisma/models/courseModel";
import { getProfesores } from "prisma/models/profesorModel";
import { getAulas } from "prisma/models/aulaModel";
import { getMovileLabs } from "prisma/models/movileLab";
import { Dias } from "@prisma/client";
import TIMESLOTS_REVERSE from "../horario.$idhorario/reversedTimes";
import { useOutletContext } from "@remix-run/react";

export default function HorarioModal() {
  const navigation = useNavigation();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const data = useLoaderData<typeof loader>();
  const isNewMatricula: boolean = data.isNewMatricula;
  const matricula = data.matricula;
  const submit = useSubmit();
  const timeSlots: string[] = Object.keys(TIMESLOTS_REVERSE)
  const location = useLocation();
  const timePicked = location.state?.timePicked;
  const searchQueries = useOutletContext();
  console.log(searchQueries);
  
  const [searchParams,setSearchParams] = useSearchParams();
  console.log(searchQueries);
  

  useEffect(() => {
    if (navigation.state === "submitting") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [navigation.state])

  useEffect(()=>{
    //const ads = document.querySelector("as").value as HTMLSelectElement;
  })

  
  function getTimeStamp(matricula_date: string) {
    let date = new Date(matricula_date);
    let stringDate = date.toLocaleDateString();
    let stringTime = date.toLocaleTimeString();
    return `${stringDate} a las ${stringTime}`
  }

  function handleChangeForm(event: any) {
    //const username = String((document.getElementById("username") as HTMLInputElement).value);
    //console.log(username);
    //submit(event.currentTarget);
  
  
    
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
    return <option value={aula.id_aula} key={aula.id_aula}>
      {`${aula.identificador}`}
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

  return <div className="overlay_styles" >
    <div className="modalContainer">
      <h2>{isNewMatricula ? "Registrar curso" : "Ver/Actualizar registro"}</h2>
      <div className="body_container">
        <Form id="courseForm"
          method="post"
          autoComplete="off"
          name="form"
          onBlur={handleChangeForm}
          preventScrollReset>
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
                  <label htmlFor="horaInicio" >Hora de inicio:</label>
                  <select
                    name="horaInicio"
                    id="horaInicio"
                    required={true}
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
                    defaultValue={(matricula ? matricula.hora_final - 1 : undefined)} >
                    <option value=""></option>
                    {timeList}
                  </select>
                </span>

                <span>
                  <label htmlFor="modalidadHorario" >Modalidad:</label>
                  <select
                    name="modalidadHorario"
                    id="modalidadHorario"
                    required={true}
                    defaultValue={matricula?.modalidad} >
                    <option value=""></option>
                    <option value={"PRESENCIAL"}>Presencial</option>
                    <option value={"BAJOVIRTUAL"}>Bajo virtual</option>
                    <option value={"BIMODAL"}>Bimodal</option>
                    <option value={"ALTOVIRTUAL"}>Alto virtual</option>
                    <option value={"VIRTUAL"}>Virtual</option>
                  </select>
                </span>
                <span>
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
                  <label htmlFor="movilHorario" >Laboratorio móvil</label>
                  <select
                    name="movilHorario"
                    id="movilHorario"
                    required={true}
                    defaultValue={matricula?.laboratorio_movil_id} >
                    <option value={""}></option>
                    {movilesLista}
                  </select>
                </span>

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
              className={btnDisabled ? "disabled" : ""}
              name="intent"
              disabled={btnDisabled}
              value={isNewMatricula ? "create" : "update"}>
              {isNewMatricula ? "Guardar" : "Actualizar"}
            </button>
            <Link to={`/horario/${data.horarioId}`} preventScrollReset={true}>
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
  const curso = Number(formData.get("cursoHorario"));
  const profesor = Number(formData.get("profesorHorario"));
  const dia = formData.get("diaHorario") as Dias;
  const horaInicio = Number(formData.get("horaInicio"));
  const horaFin = Number(formData.get("horaFin")) + 1;
  const modalidad = (formData.get("modalidadHorario"));
  const movilHorario = Number(formData.get("movilHorario"));
  const intent = formData.get("intent");
  const aula = Number(formData.get("aulaHorario"));
  const horarioId = Number(params.idhorario);
  const matriculaID = Number(params.idmatricula)

  if (intent === "create") {
    const matricula = await createMatricula(horaInicio, horaFin, dia, curso, aula, horarioId, movilHorario, profesor);
    return redirect(`/horario/${horarioId}`)
  } else if (intent === "update") {
    const matricula = await updateMatricula(matriculaID, horaInicio, horaFin, dia, curso, aula, horarioId, movilHorario, profesor);
    return redirect(`/horario/${horarioId}`)
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