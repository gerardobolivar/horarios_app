import prisma from "prisma/client";

export const getCiclos = async () => {
  return await prisma.ciclo.findMany({
    select:{
      ciclo_id: true,
      active: true,
      nombre: true,
      horario_id: true
    },
    orderBy:[
      {nombre: 'asc'}
    ]
  })
};

export const getCiclo = async (ciclo_id:number) => {
  return await prisma.ciclo.findUnique({
    where:{ ciclo_id: ciclo_id}
  })
}

export const updateCiclo = async (ciclo_id: number, horario_id: number) => {
  return await prisma.ciclo.update({
    where:{ciclo_id:ciclo_id},
    data:{
      horario_id: horario_id,
      active: true
    }
  })
};

export const bindCicloByHorario = async (ciclo_id:number, horario_id: number) => {
  return await prisma.ciclo.update({
    where:{ciclo_id: ciclo_id},
    data:{
      horario_id: horario_id,
      active: true
    }
  })
};

export const unBindCicloByHorario = async (horario_id: number) => {
  return await prisma.ciclo.update({
    where:{horario_id:horario_id},
    data:{
      horario_id: null,
      active: false
    }
  })
};

export const getBindedHorario = async (horario_id:number) => {
  return await prisma.ciclo.findUnique({
    where:{
      horario_id: horario_id
    }
  })
}

export const unBindByCiclo = async (ciclo_id:number) =>{
  return prisma.ciclo.update({
    where: {ciclo_id: ciclo_id},
    data:{
      horario_id: null,
      active: false
    }
  })
}

export const getBindedHorarioByCicle = async (cicle_id:number) => {
  return await prisma.ciclo.findUnique({
    where:{ciclo_id: cicle_id},
    select:{
      horario: true
    }
  })
}

export const createCicles = async ()=>{
return await prisma.ciclo.createMany({
  data:[
    {nombre:"CICLO I"},
    {nombre:"CICLO II"},
    {nombre:"CICLO III"},
  ]
})
}