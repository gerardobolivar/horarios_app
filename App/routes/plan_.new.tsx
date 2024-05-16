import { Form } from "@remix-run/react";

export default function PlanNew() {
  return (
    <div>
      <Form>
        <p>
          <input type="text" name="nombre" placeholder="Nombre del plan de estudios" />
        </p>
        <label>
          Código
          <input type="text" name="codigo" placeholder="Código" />
        </label>
      </Form>
    </div>
  )
}