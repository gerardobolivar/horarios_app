import prisma from "prisma/client"

export const createActiveCycle = async(ciclo_id:number)  => {
  return await prisma.activeCycle.create({
    data:{
      ciclo_id: ciclo_id
    }
  })
}

export const updateActiveCycle = async(ciclo_id: number) => {
  return await prisma.activeCycle.update({
    where:{active_cycle_id: 1},
    data:{
      ciclo_id: ciclo_id
    }
  })
}

export const removeActiveCycle = async()  => {
  return await prisma.activeCycle.delete({
    where:{active_cycle_id: 1}
  })
}

export const getActiveCycle = async()  => {
  return await prisma.activeCycle.findUnique({
    where:{active_cycle_id: 1}
  })
}

export const clearActiveCycle = async() => {
  return await prisma.activeCycle.update({
    where:{active_cycle_id: 1},
    data:{
      ciclo_id: null
    }
  })
}