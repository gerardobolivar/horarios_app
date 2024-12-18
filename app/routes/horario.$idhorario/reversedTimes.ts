
interface TIMESLOTS_REVERSE {
  [key:string] : number
}

const TIMESLOTS_REVERSE: TIMESLOTS_REVERSE = {
  "06:00-06:50":6,
  "07:00-07:50": 7,
  "08:00-08:50": 8,
  "09:00-09:50": 9,
  "10:00-10:50": 10,
  "11:00-11:50": 11,
  "12:00-12:50": 12,
  "13:00-13:50": 13,
  "14:00-14:50": 14,
  "15:00-15:50": 15,
  "16:00-16:50": 16,
  "17:00-17:50": 17,
  "18:00-18:50": 18,
  "19:00-19:50": 19,
  "20:00-20:50": 20,
  "21:00-21:50": 21,
  "22:00-22:50": 22,
};

interface TIME_SLOTS {
  [key:number] : string
}

const TIMES: TIME_SLOTS = {
  6: "06:00-06:50",
  7: "07:00-07:50",
  8: "08:00-08:50",
  9: "09:00-09:50",
  10: "10:00-10:50",
  11: "11:00-11:50",
  12: "12:00-12:50",
  13: "13:00-13:50",
  14: "14:00-14:50",
  15: "15:00-15:50",
  16: "16:00-16:50",
  17: "17:00-17:50",
  18: "18:00-18:50",
  19: "19:00-19:50",
  20: "20:00-20:50",
  21: "21:00-21:50",
  22: "22:00-22:50"
};

const SHORTEN_TIMES: TIME_SLOTS = {
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "11",
  12: "12",
  13: "13",
  14: "14",
  15: "15",
  16: "16",
  17: "17",
  18: "18",
  19: "19",
  20: "20",
  21: "21",
  22: "22"
}

interface DIAS_ {
  [key:string] : string
}

const DIAS:DIAS_ ={
   "LUNES": "LUNES",
   "MARTES": "MARTES",
   "MIERCOLES": "MIÉRCOLES",
   "JUEVES": "JUEVES",
   "VIERNES": "VIERNES",
   "SABADO": "SÁBADO"
}

const SHORTEN_DAYS:DIAS_ = {
  "LUNES": "L",
  "MARTES": "K",
  "MIERCOLES": "M",
  "JUEVES": "J",
  "VIERNES": "V",
  "SABADO": "S"
}

const MONTHS:TIME_SLOTS ={
  1: "ENERO",
  2: "FEBRERO",
  3: "MARZO",
  4: "ABRIL",
  5: "MAYO",
  6: "JUNIO",
  7: "JULIO",
  8: "AGOSTO",
  9: "SEPTIEMBRE",
  10: "OCTUBRE",
  11: "NOVIEMBRE",
  12: "DICIEMBRE"
}

export {TIMESLOTS_REVERSE, TIMES, DIAS, SHORTEN_DAYS, MONTHS, SHORTEN_TIMES};