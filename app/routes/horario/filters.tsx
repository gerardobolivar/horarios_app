import { Form, SubmitFunction } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";

export default function Filters(data: any) {
  const submit = useSubmit();
  
  return <>
  <Form method="POST" preventScrollReset={true}>
  <span>
      <label htmlFor="planEstudiosHorario" onChange={(event:any)=>{
        submit(event.currentTarget)
      }}>Plan SubmitTargetde estudios</label>
      <select name="planEstudios">
        <option value={0}>Todos</option>
        <option value={1}>Plan2</option>
        <option value={2}>Plan3</option>
      </select>
    </span>
    <span>
      <label htmlFor="diaHorario">Día</label>
      <select name="diaHorario">
        <option value={0}>Todos</option>
        <option value={1}>Dia</option>
        <option value={2}>Dia</option>
      </select>
    </span>
    <span>
      <label htmlFor="diaHorario">Ubicación</label>
      <select name="ubicacionHorario">
        <option>Todos</option>
        <option value={0}>I</option>
        <option value={1}>I</option>
      </select>
    </span>
  </Form>
  </>
}