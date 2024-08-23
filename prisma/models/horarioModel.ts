import prisma from "prisma/client"

export const getHorario = async (horarioId:number) => {
  return await prisma.horario.findUnique({
    where:{
      horario_id: horarioId
    }
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