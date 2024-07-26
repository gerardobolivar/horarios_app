import prisma from "prisma/client";

export const getMovileLabs = async ()=>{
  return await prisma.laboratorioMovil.findMany({
    select: {
      id_lab_mov: true,
      nombre: true
    }
  })
}

export const getMovileLab = async (id_lab_mov:number) =>{
  return await prisma.laboratorioMovil.findUnique({
    where:{
      id_lab_mov: id_lab_mov
    }
  })
}

export const removeMobileLab = async (id_lab_mov:number) =>{
  return await prisma.laboratorioMovil.delete({
    where:{
      id_lab_mov: id_lab_mov
    }
  })
}

export const updateMobileLab = async (id_lab_mov:number, nombre:string, detalle:string, profesor_id: number) =>{
  return await prisma.laboratorioMovil.update({
    where:{
      id_lab_mov: id_lab_mov
    },
    data:{
      nombre: nombre,
      detalle:detalle,
      profesor_id: profesor_id
    }
  })
}

export const createMovileLab = async (nombre:string, detalle:string, profesor_id: number ) =>{
  return await prisma.laboratorioMovil.create({
    data:{
      nombre: nombre,
      detalle:detalle,
      profesor_id: profesor_id
    }
  })
}