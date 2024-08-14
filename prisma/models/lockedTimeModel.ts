import { Dias } from "@prisma/client";
import prisma from "prisma/client";

export const getLockedTimesByHorario = async (horario_id:number) => {
  return await prisma.lockedTimes.findMany({
    where:{
      horario_id: horario_id
    }
  });
};

export const createLockedTime = async (dia:Dias,aula_id:number,hora_inicio:number,hora_final:number,horario_id:number ) =>{
  return await prisma.lockedTimes.create({
    data:{
      dia:dia,
      aula_id:aula_id,
      hora_inicio: hora_inicio,
      hora_final: hora_final,
      horario_id: horario_id
    }
  })
}

export const updateLockedTime = async (id_locked_time: number,dia:Dias,aula_id:number,hora_inicio:number,hora_final:number,horario_id:number ) =>{
  return await prisma.lockedTimes.update({
    where:{
      id_locked_time: id_locked_time
    },
    data:{
      dia:dia,
      aula_id:aula_id,
      hora_inicio: hora_inicio,
      hora_final: hora_final,
      horario_id: horario_id
    }
  })
}