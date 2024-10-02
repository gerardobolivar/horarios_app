import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { clearActiveCycle, getActiveCycle, updateActiveCycle } from "prisma/models/activeCycles";
import { bindCicloByHorario, unBindByCiclo, updateCiclo } from "prisma/models/cicloModel";
import { createHorario } from "prisma/models/horarioModel";

const actionCycleIdcycle = async ({ request, params }: ActionFunctionArgs) =>{
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

export default actionCycleIdcycle;