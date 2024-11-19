import { LinksFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import actionReport from "~/.server/Controller/report/action";
import loaderReport from "~/.server/Controller/report/loader";
import configPageStyles from "~/routes/cicle.$idcicle/cicleStyles.css?url";
import reportStyles from "./importStyles.css?url"
import plan_styles from '~/stylesheets/plan_.new.css?url'
import { FormEvent } from "react";
import { MONTHS, SHORTEN_DAYS, TIMES } from "../horario.$idhorario/reversedTimes";


export default function Report() {
  const data = useLoaderData<typeof loader>();
  const isAdmin = data.isAdmin;
  const planes = data.planes;
  const matriculas = data.matriculas;
  const plan_id = data.plan_id;
  const username =  data.username;
  const plan_name = data.plan_name;
  const current_date = new Date();
  const local_current_date = `${current_date.getDate()} de ${MONTHS[current_date.getMonth()+1]} del ${current_date.getFullYear()} a las ${new Date().toLocaleTimeString()}`

  const planesEstudio = planes?.map((plan) => {
    return <option value={plan.id_plan_estudio} key={plan.id_plan_estudio}>
      {`${plan.nombre_plan}`}
    </option>
  })

  const skip_styles ={
    borderBottomWidth:"0px"
  }

  const tdElement = (condition:boolean,value:string)=> {return <td style={condition ? skip_styles:{}}>{value}</td>}

  const tableDataNew = matriculas.map(m =>{

    return m.time_spans.map((t,i,array)=>{
      let should_skip:boolean|null = null;
      if(array[i-1]){
        should_skip = m.matricula_id === array[i-1].matricula_id
      }

      let should_erase_border:boolean|null = null;
      if(array[i+1]){
        should_erase_border = array[i+1].matricula_id === m.matricula_id;
      }
  
      return <tr key={i}>
        {tdElement(Boolean(should_erase_border),String(should_skip ? "" : m.group?.curso.sigla))}
        {tdElement(Boolean(should_erase_border),String(should_skip ? "" : m.group?.curso.nombre))}
        {tdElement(Boolean(should_erase_border),String(Number(m.group?.groupNumber) < 10 ? `0${m.group?.groupNumber}`:m.group?.groupNumber))}
        {tdElement(Boolean(should_erase_border),`${SHORTEN_DAYS[t.dia]} ${t.hora_inicio} a ${TIMES[t.hora_final-1].split("-")[1]}`)}
        {tdElement(Boolean(should_erase_border),String(Number(t.aula.identificador) < 10 ? `0${t.aula.identificador}`:t.aula.identificador))}
        {tdElement(Boolean(should_erase_border),String(should_skip ? "" : m.modalidad))}
        {tdElement(Boolean(should_erase_border),String(should_skip ? "" :`${m.group?.profesor.nombre} ${m.group?.profesor.primer_apellido} ${m.group?.profesor.segundo_apellido}`))}
      </tr>
    })
  })

  function handleFormChange(e:FormEvent){
    const form = e.currentTarget as HTMLFormElement;
    form.submit();
  }

  function handlePrint(){
    print();
  }

  return (
    <div className="printable">
      {isAdmin ?
        <div className="card p-3 bg-light border-0 mb-3 filterBar hide-on-print">
          <Form
            method="POST"
            onChange={(e)=>{handleFormChange(e)}}>
            <select
              className="form-select"
              name="plan_selector"
              defaultValue={plan_id ? plan_id : 0}>
              <option value={0}>General</option>
              {planesEstudio}
            </select>
          </Form>
        </div>
        : null}

      <div className="container-flex main-doc report-layout" >
        <h4 className="title">{isAdmin ? "Reporte" : "Mi reporte"}</h4>
        {plan_name === "GENERAL" ? <h6 className="show_on_print" style={{display:"none"}}>{`REPORTE GENERAL`}</h6>:
        <h6 className="show_on_print" style={{display:"none"}}>{`PLAN DE ESTUDIOS: ${String(plan_name).toLocaleUpperCase()}`}</h6>}
        
        <h6 className="show_on_print" style={{display:"none"}}>{`FECHA Y HORA: ${local_current_date}`}</h6>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Sigla</th>
              <th scope="col">Nombre del curso</th>
              <th scope="col">Grupo</th>
              <th scope="col">Horas</th>
              <th scope="col">Aula</th>
              <th scope="col">Modalidad</th>
              <th scope="col">Profesor</th>
            </tr>
          </thead>
          <tbody>{tableDataNew}</tbody>
        </table>
        <div>
          <button
            type="button"
            onClick={handlePrint}
            className="hide-on-print mainButton">Imprimir</button>
        </div>
      </div>

    </div>

  )
}

export const loader = loaderReport;
export const action = actionReport;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: configPageStyles },
  { rel: "stylesheet", href: reportStyles },
  { rel: "stylesheet", href: plan_styles },
];
