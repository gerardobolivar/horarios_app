import { SubmitFunction } from "@remix-run/react";
import { TimeSpan } from "~/types/horarioTypes";

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

export async function validEdgeTimeSpans(startTime: number, endTime: number, horarioId: number, dia: string, aula: number, whiteListKeys: string[]) {
  let result: boolean = true;
  if (endTime - startTime <= 1) {
    result = true;
  }
  else {
    for (let time = startTime + 1; time < endTime; time++) {
      if (!whiteListKeys.includes(String(time))) {
        result = false;
        break;
      }
    }
  }
  return result;
}

export async function validateTimeSpans(
    data:any,
    filters:any,
    aula:string,
    errorList:string[],
    setErrorList: React.Dispatch<React.SetStateAction<string[]>>,
    setAreThereErrors:React.Dispatch<React.SetStateAction<boolean>>): Promise<boolean>{

  const initialTime = Number((document.getElementById("horaInicio") as HTMLSelectElement).value);
  const endTime = Number((document.getElementById("horaFin") as HTMLSelectElement).value)
  const hasRangeError = errorList.includes("INAVALID_TIME_RANGE");
  const whiteListKeys = Object.keys(data.time_white_list);
  const edgesSafe = await validEdgeTimeSpans(initialTime, endTime, data.horarioId, filters.dia, Number(aula), whiteListKeys);
  let approvedValidation = false;

  if (initialTime > endTime || !edgesSafe) {
    if (!hasRangeError) {

      const newList = [...errorList];
      newList.push("INAVALID_TIME_RANGE")
      setErrorList(newList)
      setAreThereErrors(true);

    }
  } 
  else if (hasRangeError) {

    const newList = errorList.filter(e => e !== "INAVALID_TIME_RANGE")
    setErrorList(newList);

    if (newList.length < 1) { setAreThereErrors(false) }

  }
  else {

    approvedValidation = true;

  }

  return approvedValidation;
}

export async function checkForErrors(event: React.FormEvent<HTMLFormElement>, areThereErrors:boolean, formRef:React.RefObject<HTMLFormElement>, timeSpanList:TimeSpan[], submit:SubmitFunction){
  
  if (areThereErrors) {
    event.preventDefault();
    throw "INVALID_FORM_STATE"
  } else {
    event.preventDefault();


    if (formRef.current) {
      const formData = new FormData(formRef.current);
      formData.append("time_spans", JSON.stringify(timeSpanList));
      const submitter = (event.nativeEvent as SubmitEvent).submitter
      const intent = (submitter as HTMLButtonElement).value
      formData.append("intent", intent);
      submit(formData, { method: "POST" });
    }
  }

}