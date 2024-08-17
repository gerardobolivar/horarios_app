import { Form, SubmitFunction, useSearchParams } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import { Planes } from "~/types/horarioTypes";

type Props = {
  horarioId: number,
  data: any,
  planes: Planes
}
const Filters: React.FC<Props> = ({ horarioId, planes, data }) => {
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();

  const planesEstudio = planes.map((plan) => {
    return <option value={plan.id_plan_estudio} key={plan.id_plan_estudio}>
      {`${plan.nombre_plan}`}
    </option>
  })

  function handleChangeForm(event: any) {
    
    const params = new URLSearchParams();
    let planEstudios = event.currentTarget.querySelector('select[name="planEstudios"]').value;
    let dia = event.currentTarget.querySelector('select[name="diaHorarioFilter"]').value;
    let ubicacion = event.currentTarget.querySelector('select[name="ubicacionHorario"]').value;
    const showVirtual = event.currentTarget.querySelector('input[name="show_virtual"]').checked;
    
    
    
    params.set("planEstudios", `${planEstudios}`);
    params.set("dia", `${dia}`);
    params.set("ubicacion", `${ubicacion}`);
    params.set("showvirtual", `${showVirtual}`);
    
    if(showVirtual){
      submit(event.currentTarget)
    }
    
    setSearchParams(params, { preventScrollReset: true, });
  }

  return <>
    <Form
      method="POST"
      id="filtersSchedule"
      preventScrollReset={true}
      onChange={(e) => { handleChangeForm(e) }}
      action={`/horario/${horarioId}`}>
      <span>
        <label htmlFor="planEstudios">Plan de estudios</label>
        <select
          name="planEstudios"
          defaultValue={0}>
          <option value={0}>Todos</option>
          {planesEstudio}
        </select>
      </span>
      <span>
        <label htmlFor="diaHorarioFilter">Día</label>
        <select
          name="diaHorarioFilter"
          defaultValue={"LUNES"}>
          <option value={"LUNES"}>Lunes</option>
          <option value={"MARTES"}>Martes</option>
          <option value={"MIERCOLES"}>Miércoles</option>
          <option value={"JUEVES"}>Jueves</option>
          <option value={"VIERNES"}>Viernes</option>
          <option value={"SABADO"}>Sábado</option>
        </select>
      </span>
      <span>
        <label htmlFor="ubicacionHorario">Ubicación</label>
        <select
          name="ubicacionHorario"
          defaultValue={"0"}>
          <option value={"0"}>Todos</option>
          <option value={"1"}>1</option>
          <option value={"2"}>2</option>
          <option value={"3"}>3</option>
          <option value={"4"}>4</option>
          <option value={"5"}>5</option>
        </select>
      </span>
      <div>
        <span>
          <label htmlFor="show_virtual">Mostrar cursos virtuales</label>
          <input
            type="checkbox"
            id="shVirt"
            name="show_virtual"
            onChange={()=>{}}
            checked={searchParams.get("showvirtual") === "true" ? true:false}
            value="true"></input>
        </span>
      </div>
    </Form>
  </>
}

export default Filters;