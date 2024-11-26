import prisma from "prisma/client"

export const getHorario = async (horarioId:number) => {
  return await prisma.horario.findUnique({
    where:{
      horario_id: horarioId
    }
  })
}

export const createHorario = async () => {
  return await prisma.horario.create({
    data:{
      active: true
    }
  })
}

export const getHorarios = async () =>{
  return await prisma.horario.findMany({
    select:{horario_id:true}
  })
}

export const getBindedHorarioByCicle = async (horario_id:number) => {
  return await prisma.horario.findUnique({
    where: {
      horario_id: horario_id,
      ciclo:{
        horario_id: horario_id
      }
    }
  });
}

export const activateHorarioById = async (horario_id: number) =>{ 
  return await prisma.horario.update({
    where: {horario_id: horario_id},
    data:{
      active: true
    }
  })
}

export const deactivateHorarioById = async (horario_id: number) =>{ 
  return await prisma.horario.update({
    where: {horario_id: horario_id},
    data:{
      active: false
    }
  })
}

export const updateUpdateDate = async (horario_id: number) => {
  return await prisma.horario.update({
    where:{horario_id: horario_id},
    data:{
      fecha_modificado: new Date()
    }
  })
}

export const getHorarioState = async (horarioId:number) => {
  return await prisma.horario.findUnique({
    where:{
      horario_id: horarioId
    },
    select:{
      active:true
    }
  })
}

/*HorarioCloseTime MODEL*/

export const createHorarioCloseTime = async (datetime:Date, horario_id:number) => {
  return await prisma.horarioCloseTime.create({
    data:{
      datetime: datetime,
      horario_id: horario_id,
    }
  })
}

export const deleteHorarioCloseTime = async (horario_id:number) => {
  return await prisma.horarioCloseTime.delete({
    where:{
      horario_id: horario_id
    }
  })
}

export const countHorarioCloseTime = async (horario_id:number) => {
  return await prisma.horarioCloseTime.count({
    where:{
      horario_id: horario_id
    }
  })
}

export const getHorarioCloseTimeByHorario = async (horario_id:number) => {
  return await prisma.horarioCloseTime.findUnique({
    where:{
      horario_id: horario_id
    }
  })
}

export const updateVisibility = async (horario_id: number, visible:string) => {
  if(visible.length > 1 || visible.length <= 0){
    console.error("Ivalid string length. Horarios: Visible value?");
    return null;
  }else{
    return await prisma.horario.update({
      where:{horario_id: horario_id},
      data:{
        visible: visible
      }
    })
  }
}