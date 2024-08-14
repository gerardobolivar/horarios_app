// This is the place where the system is going to validate wether an schedule can be saved in the system.

import { Dias } from "@prisma/client";
import { Matricula } from "~/types/horarioTypes";


function isScheduleAvailable(fecha_inicio:number,fecha_final:number):Boolean {
  let isAvailable:boolean = false;
  return isAvailable
}


function getAvailableTimePerDay(day:Dias){
  //Obtain the times where there is not courses in Monday
}


export {isScheduleAvailable}