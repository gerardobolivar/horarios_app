import { Form, useSearchParams } from "@remix-run/react";
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
    const hideEmpty = event.currentTarget.querySelector('input[name="show_empty"]').checked;
    params.set("planEstudios", `${planEstudios}`);
    params.set("dia", `${dia}`);
    params.set("ubicacion", `${ubicacion}`);
    params.set("showvirtual", `${showVirtual}`);
    params.set("hideempty", `${hideEmpty}`);

    if (showVirtual) {
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
      className="filters-form"
      action={`/horario/${horarioId}`}>
      <div className="card p-3 bg-light border-0 mb-3">

        <div className="fil-selectors">
          <div>
            <select
              name="planEstudios"
              defaultValue={0}
              className="form-select form-select-lg mb-3"
              aria-label=".form-select-lg example">
              <option value={0}>Plan de estudio</option>
              {planesEstudio}
            </select>
          </div>

          <div>
            <select
              name="diaHorarioFilter"
              defaultValue={"LUNES"}
              className="form-select form-select-lg mb-3"
              aria-label=".form-select-lg example">
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
              aria-label=".form-select-lg example">
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
              onChange={() => { }}
              className="largerCheckBox form-check-input"
              checked={searchParams.get("showvirtual") === "true" ? true : false}
              value="true"></input>
          </div>
          <div className="form-check">
            <label className="form-check-label" htmlFor="shEmpty">Ocultar vacías</label>
            <input
              type="checkbox"
              id="shEmpty"
              name="show_empty"
              onChange={() => { }}
              className="largerCheckBox form-check-input"
              checked={searchParams.get("hideempty") === "true" ? true : false}
              value="true"></input>
          </div>
        </div>
      </div>
    </Form>
  </>
}

export default Filters;