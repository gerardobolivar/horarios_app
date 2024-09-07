// This is the place where the system is going to validate wether an schedule can be saved in the system.

import { TIMESLOTS, TIMESLOTS_ } from "~/.server/allowedTimes";
import { TIMES } from "~/routes/horario.$idhorario/reversedTimes";
import { LockTime } from "~/types/horarioTypes";


function isScheduleAvailable(fecha_inicio: number, fecha_final: number): Boolean {
  let isAvailable: boolean = false;
  return isAvailable
}


function generateTimeWhiteList(lockedTimes: LockTime[], dia: string, aula: number) {

  let blackList: TIMESLOTS_ = {};
  const filteredTimes: TIMESLOTS_ = {};
  if (lockedTimes.length >= 1) {
    
    lockedTimes.map((lt) => {
      const currentStartTime = lt.hora_inicio
      const currentEndTime = lt.hora_final
      for (let time = 6; time < 23; time++) {
        if (((currentStartTime === time || currentEndTime - 1 === time || time > currentStartTime && time < currentEndTime) && dia === lt.dia && aula == lt.aula_id)) {
          blackList[time] = TIMESLOTS[time];
        }
      }
    })

    Object.keys(TIMES).map((t) => {
      if (!Object.hasOwn(blackList, t)) {
        filteredTimes[Number(t)] = TIMES[Number(t)]
      }
    })

  }else{

    Object.keys(TIMES).map((t) => {
      filteredTimes[Number(t)] = TIMES[Number(t)]
    })
  }
  
  
  
  return filteredTimes;
}


export { isScheduleAvailable, generateTimeWhiteList }