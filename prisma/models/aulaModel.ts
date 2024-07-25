import prisma from "prisma/client";

export const getAulas = async ()=>{
  return await prisma.aula.findMany({
    select: {
      id_aula: true,
      identificador: true
    }
  })
}

export const getAula = async (id_aula:number) =>{
  return await prisma.aula.findUnique({
    where:{
      id_aula: id_aula
    }
  })
}

export const removeAula = async (id_aula:number) =>{
  return await prisma.aula.delete({
    where:{
      id_aula: id_aula
    }
  })
}

export const updateAula = async (id_aula:number, identificador:string, cupo:number, detalle:string, edificio:string ) =>{
  return await prisma.aula.update({
    where:{
      id_aula: id_aula
    },
    data:{
      id_aula: id_aula,
      identificador: identificador,
      cupo: cupo,
      detalle: detalle,
      edificio: edificio
    }
  })
}

export const createAula = async (identificador:string, cupo:number, detalle:string, edificio:string ) =>{
  return await prisma.aula.create({
    data:{
      identificador: identificador,
      cupo: cupo,
      detalle: detalle,
      edificio: edificio
    }
  })
}