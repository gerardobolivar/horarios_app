import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { bindCicloByHorario, getBindedHorarioByCicle, getCiclo, unBindByCiclo, unBindCicloByHorario, updateCiclo } from "prisma/models/cicloModel";
import { getTimeStamp } from "../horario.$idhorario.$idmatricula/utils";
import configPageStyles from "./cicleStyles.css?url";
import { createHorario, getHorarios } from "prisma/models/horarioModel";
import { clearActiveCycle, getActiveCycle, updateActiveCycle } from "prisma/models/activeCycles";

export default function Cicle() {
  const data = useLoaderData<typeof loader>();
  const ciclo = data.ciclo;
  const horario = data.horario?.horario;
  const listaHorarios = data.listaHorarios?.map((h) => {
    return <option key={h.horario_id} value={h.horario_id}>{`${h.horario_id}`}</option>
  })
  const isActiveCycle = data.activeCycle?.ciclo_id === ciclo.ciclo_id;

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
          <p >Estado: {isActiveCycle ? "Activo" : "Inactivo"} <i className="bi bi-info-circle tooltip_">
            <span className="tooltiptext no-select">{isActiveCycle ? "El ciclo es el vigente y se ecuentra activo." : "El ciclo no es el vigente y se encuentra inactivo"}</span>
          </i></p>
        </article>
      </section>
      <section
        className="main-section"
        id="Archivar">
        <header>Configuración</header>
        <Form method="POST">
          <article>
            <label htmlFor="horario_vinculado">Horario vinculado:</label>
            <select
              name="horario_vinculado"
              id="horario_vinculadoID"
              defaultValue={horario ? horario.horario_id : ""}>
              <option value="">Ninguno</option>
              {listaHorarios}
            </select>
          </article>
          <article>
            <label>Crear asignar un horario nuevo:</label>
            <button
              name="intent"
              value="create_new_schedule"
              disabled={horario ? true : false}>Crear
            </button>
          </article>
          <article>
            <label htmlFor="setAsCurrentCycle">Establecer como ciclo vigente:</label>
            <input
              type="checkbox"
              defaultChecked={isActiveCycle}
              name="setAsCurrentCycle"
            />
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
  const setAsActive = Boolean(formData.get("setAsCurrentCycle"));
  const activeCycle = await getActiveCycle().then(r => r, () => null).catch((e) => {
    console.error(e);
    return null;
  });




  if (intent === "save_cicle_config") {
    if (setAsActive) {
      if (horarioId) {
        await updateActiveCycle(cicloID).catch(e => {
          console.error(e);
        });
      } else {
        const url = new URL(request.url);
        url.pathname = "/error";
        url.searchParams.set("reason", "NO_SCHEDULE_ASSIGMENT");
        return redirect(url.toString());
      }
    } else {
      if (activeCycle?.ciclo_id === cicloID) {
        await clearActiveCycle().catch(e => {
          console.error(e);
        })
      }
    }

    if (horarioId === "" || horarioId === null || horarioId === undefined) {
      return await clearActiveCycle().then(async () => {
        await unBindByCiclo(cicloID);

        return redirect(`/cicle/${cicloID}`);
      }).catch((e) => {
        console.error(e);
        return redirect(`/error`)
      })
    }
    else {
      return await updateCiclo(cicloID, Number(horarioId)).then(async () => {
        return redirect(`/cicle/${cicloID}`)
      }).catch((e) => {
        if (e.code === "P2002") {
          console.error(`Unique constraint failed on the model ${e.meta.modelName}`);
          const url = new URL(request.url);
          url.pathname = "/error";
          url.searchParams.set("reason", "BUSSY_SCHEDULE");
          return redirect(url.toString());
        } else {
          return redirect("/error")
        }
      })
    }

  } else if (intent === "create_new_schedule") {
    if (!!horarioId === false) {
      return await createHorario().then(async (r) => {
        return await bindCicloByHorario(cicloID, r.horario_id).then(async () => { // This must a transaction. The current factor is propen to bugs due to bad data sate.
          await updateActiveCycle(cicloID); // This must a transaction. The current factor is propen to bugs bad data sate
          return redirect(`/`)
        }).catch((e) => {
          console.error(e);
          return redirect("/error")
        })
      }).catch((e) => {
        console.error(e);
        return redirect("/error");
      })
    } {
      console.error("The cicle is already binded to a schedule.");

      return redirect("/error");
    }
  }
}

export const loader = async ({ params, }: LoaderFunctionArgs) => {
  const cicloID = Number(params.idcicle)
  const ciclo = await getCiclo(cicloID).then((r) => r).catch((e) => { return null })
  const horario = await getBindedHorarioByCicle(cicloID).then(r => r).catch((e) => {
    console.error(e);
    return null;
  })

  const activeCycle = await getActiveCycle().then(r => r, () => null).catch((e) => {
    console.error(e);
    return null;
  });

  const listaHorarios = await getHorarios().then(r => r).catch((e) => {
    console.error(e);
    return null;
  })

  if (ciclo === null) {
    return redirect("/error");

  } else {
    return json({ ciclo: ciclo, horario: horario, listaHorarios: listaHorarios, activeCycle: activeCycle })
  }

}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: configPageStyles },
];