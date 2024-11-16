import { Form, useSearchParams } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import { ChangeEvent, useState } from "react";
import { Planes } from "~/types/horarioTypes";

type Props = {
  horarioId: number,
  data: any,
  planes: Planes,
  setHideEmpty: React.Dispatch<React.SetStateAction<boolean>>,
  setShowVirtual: React.Dispatch<React.SetStateAction<boolean>>
}
const Filters: React.FC<Props> = ({ horarioId, planes, data, setHideEmpty, setShowVirtual }) => {
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();
  const [show_virtual, setShow_virtual] = useState(false);
  const [hide_empty, setHide_empty] = useState(false);

  const planesEstudio = planes.map((plan) => {
    return <option value={plan.id_plan_estudio} key={plan.id_plan_estudio}>
      {`${plan.nombre_plan}`}
    </option>
  })

  function handleChangeForm(event: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    const form = document.getElementById("filtersSchedule") as HTMLFormElement;
    let planEstudios = (form.querySelector('select[name="planEstudios"]') as HTMLSelectElement).value;    
    let dia = (form.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value
    let ubicacion = (form.querySelector('select[name="ubicacionHorario"]') as HTMLSelectElement).value
    params.set("planEstudios", `${planEstudios}`);
    params.set("dia", `${dia}`);
    params.set("ubicacion", `${ubicacion}`);

    setSearchParams(params, { preventScrollReset: true, });
  }

  function handleHideEmpty(e:ChangeEvent<HTMLInputElement>){
     const isChecked = Boolean(e.currentTarget.checked);
    if(isChecked){
      setHideEmpty(true);
      setHide_empty(true);
    }else{
      setHideEmpty(false);
      setHide_empty(false);
    }
  }

  function handleShowVirtual(e:ChangeEvent<HTMLInputElement>){
    const isChecked = Boolean(e.currentTarget.checked)
    if(isChecked){
      setShowVirtual(true);
      setShow_virtual(true);
    }else{
      setShowVirtual(false);
      setShow_virtual(false);
    }
  }

  return <>
    <Form
      method="POST"
      id="filtersSchedule"
      preventScrollReset={true}
      className="filters-form"
      action={`/horario/${horarioId}`}>
      <div className="card p-3 bg-light border-0 mb-3">

        <div className="fil-selectors">
          <div>
            <select
              name="planEstudios"
              defaultValue={0}
              className="form-select form-select-lg mb-3"
              aria-label=".form-select-lg example"
              onChange={(e)=>{handleChangeForm(e)}}>
              <option value={0}>Plan de estudio
              </option>
              {planesEstudio}
            </select>
          </div>

          <div>
            <select
              name="diaHorarioFilter"
              defaultValue={"LUNES"}
              className="form-select form-select-lg mb-3"
              aria-label=".form-select-lg example"
              onChange={(e)=>{handleChangeForm(e)}}>
              <option value={"LUNES"}>Lunes</option>
              <option value={"MARTES"}>Martes</option>
              <option value={"MIERCOLES"}>Miércoles</option>
              <option value={"JUEVES"}>Jueves</option>
              <option value={"VIERNES"}>Viernes</option>
              <option value={"SABADO"}>Sábado</option>
            </select>
          </div>

          <div>
            <select
              name="ubicacionHorario"
              defaultValue={"0"}
              className="form-select form-select-lg mb-3"
              aria-label=".form-select-lg example"
              onChange={(e)=>{handleChangeForm(e)}}>
              <option value={"0"}>Ubicación en el plan</option>
              <option value={"1"}>1</option>
              <option value={"2"}>2</option>
              <option value={"3"}>3</option>
              <option value={"4"}>4</option>
              <option value={"5"}>5</option>
            </select>
          </div>
        </div>

        <div className="d-flex align-items-center gap-4 fil-checkboxes">
          <div className="form-check">
            <label className="form-check-label" htmlFor="shVirt">Cursos virtuales</label>
            <input
              type="checkbox"
              id="shVirt"
              name="show_virtual"
              onChange={(e) => { handleShowVirtual(e)}}
              className="largerCheckBox form-check-input"
              checked={show_virtual}
              value="true"></input>
          </div>
          <div className="form-check">
            <label className="form-check-label" htmlFor="shEmpty">Ocultar vacías</label>
            <input
              type="checkbox"
              id="shEmpty"
              name="show_empty"
              onChange={(e) => { handleHideEmpty(e)}}
              className="largerCheckBox form-check-input"
              checked={hide_empty}
              value="true"></input>
          </div>
        </div>
      </div>
    </Form>
  </>
}

export default Filters;