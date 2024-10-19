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
  data: any,
  filters: any,
  aula: string,
  errorList: string[],
  timeSpans: TimeSpan[],
  setErrorList: React.Dispatch<React.SetStateAction<string[]>>,
  setAreThereErrors: React.Dispatch<React.SetStateAction<boolean>>): Promise<boolean> {

  const initialTime = Number((document.getElementById("horaInicio") as HTMLSelectElement).value);
  const endTime = Number((document.getElementById("horaFin") as HTMLSelectElement).value)
  const hasRangeError = errorList.includes("INAVALID_TIME_RANGE");
  const hasDuplicatedError = errorList.includes("DUPLICATED_TIME_RANGE");
  const whiteListKeys = Object.keys(data.time_white_list);
  const edgesSafe = await validEdgeTimeSpans(initialTime, endTime, data.horarioId, filters.dia, Number(aula), whiteListKeys);
  const isAnyTimeSpanEmpty = (document.getElementById("horaInicio") as HTMLSelectElement).value === "" || (document.getElementById("horaFin") as HTMLSelectElement).value === ""
  const rangeError = initialTime > endTime; 
  let approvedValidation = false;

  const timeSpan: TimeSpan = {
    aula_id: Number((document.querySelector('select[name="aulaHorario"]') as HTMLSelectElement).value),
    matricula_id: data.matricula?.matricula_id as number,
    hora_inicio: initialTime,
    hora_final: endTime,
    dia: (document.querySelector('select[name="diaHorarioFilter"]') as HTMLSelectElement).value,
    type: (document.querySelector('select[name="tipoHoras"]') as HTMLSelectElement).value
  }

  const isDuplicated = checkDuplicates(timeSpans, timeSpan);
  let newList = [...errorList];

  if (rangeError || !edgesSafe || isAnyTimeSpanEmpty) {
    if (!hasRangeError) {
      newList.push("INAVALID_TIME_RANGE")
      setErrorList(newList);
      setAreThereErrors(true);
    }
  }

  if (isDuplicated) {
    newList.push("DUPLICATED_TIME_RANGE")
    setErrorList(newList)
    setAreThereErrors(true);

  }

  if (newList.length > 0) {

    if (hasRangeError && (rangeError === false && edgesSafe === true && isAnyTimeSpanEmpty === false)) {
      newList = newList.filter(e => e !== "INAVALID_TIME_RANGE")
      setErrorList(newList);
    }
    
    if (hasDuplicatedError && !isDuplicated) {
      newList = newList.filter(e => e !== "DUPLICATED_TIME_RANGE")
      setErrorList(newList);
    }

    if (newList.length < 1) { setAreThereErrors(false) }
  }
  else {

    approvedValidation = true;

  }

  return approvedValidation;
}

export async function checkForErrors(event: React.FormEvent<HTMLFormElement>, areThereErrors: boolean, formRef: React.RefObject<HTMLFormElement>, timeSpanList: TimeSpan[], submit: SubmitFunction,times_to_remove:number[]) {
  //if (areThereErrors) {event.preventDefault();throw new Error("INVALID_FORM_STATE")} else {}
  event.preventDefault();
  const timeSpanListJSON = JSON.stringify(timeSpanList);
  const validTimeSpanList = timeSpanListJSON.length >= 1;

  if (formRef.current && validTimeSpanList) {
    const formData = new FormData(formRef.current);
    formData.append("time_spans", timeSpanListJSON);
    formData.append("times_to_remove", JSON.stringify(times_to_remove));
    const submitter = (event.nativeEvent as SubmitEvent).submitter
    const intent = (submitter as HTMLButtonElement).value
    formData.append("intent", intent);
    submit(formData, { method: "POST" });
  }

}


export function checkDuplicates(timeSpans: TimeSpan[], timeSpan: TimeSpan): boolean {
  const duplicates = timeSpans.filter(ts => ts.aula_id === timeSpan.aula_id && ts.dia === timeSpan.dia && ts.hora_inicio === timeSpan.hora_inicio && ts.hora_final === timeSpan.hora_final + 1)
  return !!duplicates.length;
}

export function isAvailable(timeList:TimeSpan[],time:TimeSpan):Boolean{
  let isAvailable = true;
  timeList.map((t)=>{
    if( t.dia === time.dia &&
      (t.hora_inicio === time.hora_inicio || 
      t.hora_final === time.hora_final+1 || 
      (t.hora_inicio < time.hora_inicio && time.hora_inicio < t.hora_final  ) ||
      (t.hora_inicio < time.hora_final+1 && time.hora_final+1 < t.hora_final ))){
        isAvailable = false;
    }
  })

  return isAvailable;
}