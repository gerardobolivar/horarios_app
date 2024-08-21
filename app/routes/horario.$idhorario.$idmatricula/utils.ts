import { Dias } from "@prisma/client";
import { TIMES } from "~/routes/horario.$idhorario/reversedTimes";
import { getLockedTimesByHorarioDay } from "prisma/models/matriculaModelo";
import { LockTime } from "~/types/horarioTypes";

export function getTimeStamp(matricula_date: string) {
  let date = new Date(matricula_date);
  let stringDate = date.toLocaleDateString();
  let stringTime = date.toLocaleTimeString();
  return `${stringDate} a las ${stringTime}`
}

export function handleModalidadChange(event: any, setIsVirtual: any, setSearchParams: any, aula: string) {
  const modalidad = event.currentTarget.value;
  const aulaSelector = (document.getElementById("aulaHorario") as HTMLSelectElement);
  const virtualClassroomValue = ((document.getElementById("aulaHorario") as HTMLSelectElement).querySelector("option[hidden]") as HTMLOptionElement).value;
  const diaFilters = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value;
  const diaForm = (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement);
  diaForm.value = diaFilters
  
  
  if (modalidad === "VIRTUAL") {
    const xpath = "//option[text()='Aula 999']";
    const selectorAula = document.getElementById("aulaHorario");
    (document.getElementById("horaInicio") as HTMLSelectElement).value = "";
    (document.getElementById("horaFin") as HTMLSelectElement).value = "";

    const valorAulaVirtual = document.evaluate(xpath, selectorAula as Node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLOptionElement;
    
    setIsVirtual(true);
    aulaSelector.value = virtualClassroomValue;
    const params = new URLSearchParams();
    params.set("aula", `${valorAulaVirtual.value}`);
    params.set("dia", `${diaFilters}`);
    setSearchParams(params)
  } else {
    aulaSelector.value = ""
    setIsVirtual(false);
  }
}

export async function validEdgeTimeSpans(startTime: number, endTime: number, horarioId: number, dia: Dias, aula: number, whiteListKeys: string[]) {
  let result: boolean = true;
  if (endTime - startTime <= 1) {
    result = true;
  }
  else {
    const lockedTimesByHorario: LockTime[] = await getLockedTimesByHorarioDay(horarioId, dia).then((r) => { return r }, () => { return [] })
    for (let time = startTime + 1; time < endTime; time++) {
      if (!whiteListKeys.includes(String(time))) {
        result = false;
        break;
      }
    }
  }
  return result;
}

//Migrating functions to this file.
// export function validateTimeSpans(errorList:string[],setErrorList:any,setAreThereErrors:any): boolean {
//   const initialTime = Number((document.getElementById("horaInicio") as HTMLSelectElement).value);
//   const endTime = Number((document.getElementById("horaFin") as HTMLSelectElement).value)
//   let approvedValidation = false;
//   const hasRangeError = errorList.includes("INAVALID_TIME_RANGE");

//   if (initialTime > endTime) {
//     if (!hasRangeError) {
//       const newList = [...errorList];
//       newList.push("INAVALID_TIME_RANGE")
//       setErrorList(newList)
//       setAreThereErrors(true);
//     }
//   } else if (hasRangeError) {
//     const newList = errorList.filter(e => e !== "INAVALID_TIME_RANGE")
//     setErrorList(newList);
//     if (newList.length < 1) { setAreThereErrors(false) }
//   }
//   else {
//     approvedValidation = true;

//   }
//   return approvedValidation;
// }

// export function checkForErrors(event: any,errorList:string[],setErrorList:any,setAreThereErrors:any) {
//   if (!validateTimeSpans(errorList,setErrorList,setAreThereErrors)) {
//     event.preventDefault();
//   }
// }