import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { bindCicloByHorario, getBindedHorarioByCicle, getCiclo, unBindByCiclo, unBindCicloByHorario, updateCiclo } from "prisma/models/cicloModel";
import { getTimeStamp } from "../horario.$idhorario.$idmatricula/utils";
import configPageStyles from "./cicleStyles.css?url";
import { createHorario, getHorarios } from "prisma/models/horarioModel";

export default function Cicle() {
  const data = useLoaderData<typeof loader>();
  const ciclo = data.ciclo;
  const horario = data.horario?.horario;
  const listaHorarios = data.listaHorarios?.map((h) => {
    return <option key={h.horario_id} value={h.horario_id}>{`${h.horario_id}`}</option>
  })


  return <>
    <main id="main-doc">
      <section
        className="main-section"
        id="General">
        <header>Información General</header>
        <article>
          <p>Nombre: {ciclo.nombre}</p>
          <p>Creado: {getTimeStamp(ciclo.fecha_creado)}</p>
          <p>Modificado: {getTimeStamp(ciclo.fecha_modificado)}</p>
          <p >Estado: {ciclo.active ? "Activo" : "Inactivo"} <i className="bi bi-info-circle tooltip_">
            <span className="tooltiptext no-select">{ciclo.active ? "El ciclo es el vigente y se ecuentra activo." : "El ciclo no es el vigente y se encuentra inactivo"}</span>
          </i></p>
        </article>
      </section>
      <section
        className="main-section"
        id="Archivar">
        <header>Configuración</header>
        <Form method="POST">
          <article>
            <h5>Horario</h5>
            <label htmlFor="horario_vinculado">Horario vinculado:</label>
            <select
              name="horario_vinculado"
              id="horario_vinculadoID"
              defaultValue={horario ? horario.horario_id : ""}>
              <option value="">Ninguno</option>
              {listaHorarios}
            </select>
          </article>
          <label>Crear asignar un horario nuevo:</label>
          <button name="intent" value="create_new_schedule"> Crear</button>
          <article>
            <h5></h5>
          </article>
          <button
            type="submit"
            name="intent"
            value="save_cicle_config"
            className="mainButton">Cuardar cambios</button>
        </Form>
      </section>
    </main>
  </>

}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const cicloID = Number(params.idcicle)
  const horarioId = formData.get("horario_vinculado");
  console.log(horarioId);


  if (intent === "save_cicle_config") {
    if (horarioId === "" || horarioId === null || horarioId === undefined) {
      return await unBindByCiclo(cicloID).then(() => {
        return redirect(`/cicle/${cicloID}`);
      }).catch((e) => {
        console.error(e);
        return redirect(`/error`)
      })
    }
    else {
      return await updateCiclo(cicloID, Number(horarioId)).then(() => {
        return redirect(`/cicle/${cicloID}`)
      }).catch((e) => {
        console.error(e);
        return redirect("/error")
      })
    }

  } else if (intent === "create_new_schedule") {
    //Create a new schedule
    return await createHorario().then(async (r) => {
      //Bind the created schedule to the current Cicle
      return await bindCicloByHorario(cicloID, r.horario_id).then(() => {
        return redirect(`/`)
      }).catch((e) => {
        console.error(e);
        return redirect("/error")
      })
    }).catch((e) => {
      console.error(e);
      return redirect("/error");
    })
  }
}

export const loader = async ({ params, }: LoaderFunctionArgs) => {
  const cicloID = Number(params.idcicle)
  const ciclo = await getCiclo(cicloID).then((r) => r).catch((e) => { return null })
  const horario = await getBindedHorarioByCicle(cicloID).then(r => r).catch((e) => {
    console.error(e);
    return null;
  })

  const listaHorarios = await getHorarios().then(r => r).catch((e) => {
    console.error(e);
    return null;
  })

  if (ciclo === null) {
    return redirect("/error");

  } else {
    return json({ ciclo: ciclo, horario: horario, listaHorarios: listaHorarios })
  }

}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: configPageStyles },
];