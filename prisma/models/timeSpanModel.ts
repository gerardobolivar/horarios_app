import prisma from "prisma/client"
import { getGroupByMatricula, updateGroup } from "./groupModel"

export const createTimeSpan = async (
  matricula_id: number,
  aula_id: number,
  dia: string,
  hora_inicio: number,
  hora_final: number,
  type?:string) => {
  return await prisma.time_span.create({
    data: {
      matricula_id: matricula_id,
      hora_inicio: hora_inicio,
      hora_final: hora_final,
      aula_id: aula_id,
      dia: dia,
      type: type,
    }
  })
}

export const updateTimeSpan = async (
  time_span_id: number,
  matricula_id: number,
  aula_id: number,
  dia: string,
  hora_inicio: number,
  hora_final: number) => {
  return await prisma.time_span.update({
    where: {
      time_span_id: time_span_id
    },
    data: {
      matricula_id: matricula_id,
      hora_inicio: hora_inicio,
      hora_final: hora_final,
      aula_id: aula_id,
      dia: dia
    }
  })
}

export const deleteTimeSpanByIdOld = async (time_span_id: number) => {
  return await prisma.time_span.delete({
    where: { time_span_id: time_span_id }
  })
}

export const deleteTimeSpanById = async (time_span_id: number) => {
  return await prisma.$transaction(async (tx)=>{
    const timeSpan = await getTimeSpanById(time_span_id);
    let hoursToRecover:number;
    const matriculaID = timeSpan?.matricula_id 

    if(timeSpan?.hora_final !== undefined && timeSpan?.hora_inicio !== undefined && matriculaID !== undefined){
      const group = (await getGroupByMatricula(matriculaID))[0];
      hoursToRecover = group.Ahours + (timeSpan?.hora_final - timeSpan?.hora_inicio);
      await updateGroup(group.group_id, hoursToRecover);
       
    }else{
      throw new Error("Could not find times for this time span.")
    }

    await tx.time_span.delete({
      where:{
        time_span_id: timeSpan.time_span_id
      }
    })

  })
}

export const deleteTimeSpansByMatriculaId = async (matricula_id: number) => {
  return await prisma.time_span.deleteMany({
    where: {
      matricula_id: matricula_id
    }
  })
}

export const getTimeSpanById = async (time_span_id: number) => {
  return await prisma.time_span.findUnique({
    where: { time_span_id: time_span_id }
  })
}

export const getTimeSpanByMatricula = async (matricula_id: number) => {
  return prisma.time_span.findMany({
    where:{ matricula_id: matricula_id}
  })
}

export const getTimesSpanBySchedule = async (horario_Id: number, dia?:string, id_plan_estudio?:number, ubicacion?:string) => {
  return await prisma.time_span.findMany({
    where: {
      matricula: {
        horario_id: horario_Id,
        group:{
          curso:{
            plan_id: id_plan_estudio,
            ubicacion: ubicacion
          }
        }
      },
      dia: dia
    },
    include: {
      aula: true,
      matricula: {
        include: {
          group: {
            include: {
              curso: true,
              profesor: true,
            }
          }
        }
      }
    }
  })
}

export const getTimeSpanSByHorarioDia = async (horario_id: number, dia:string) => {
  return await prisma.time_span.findMany({
    where: {
      matricula:{
        horario_id: horario_id,
      },
      dia: dia
    },
    select:{
      aula_id:true,
      hora_inicio: true,
      hora_final: true,
      dia: true,
    }
  })
}