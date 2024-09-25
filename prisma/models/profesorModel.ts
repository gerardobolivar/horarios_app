import prisma from "prisma/client";

export const getProfesores = async ()=>{
  return await prisma.profesor.findMany({
    select: {
      id_profesor: true,
      nombre:true,
      primer_apellido: true,
      segundo_apellido: true
    }
  })
}

export const getProfesoresByUserId = async (userId: number)=>{
  return await prisma.profesor.findMany({
    where:{
      user_id: userId
    },
    select: {
      id_profesor: true,
      nombre:true,
      primer_apellido: true,
      segundo_apellido: true
    }
  })
}

export const getProfesor = async (id_profesor:number) =>{
  return await prisma.profesor.findUnique({
    where:{
      id_profesor: id_profesor
    }
  })
}

export const removeProfesor = async (id_profesor:number) =>{
  return await prisma.profesor.delete({
    where:{
      id_profesor: id_profesor
    }
  })
}

export const updateProfesor = async (id_profesor:number, nombre:string, primer_apellido:string, segundo_apellido:string, email:string ) =>{
  return await prisma.profesor.update({
    where:{
      id_profesor: id_profesor
    },
    data:{
      id_profesor: id_profesor,
      nombre: nombre,
      primer_apellido: primer_apellido,
      segundo_apellido: segundo_apellido,
      email: email
    }
  })
}

export const createProfesor = async (nombre:string, primer_apellido:string, segundo_apellido:string, email:string, user_id: number ) =>{
  return await prisma.profesor.create({
    data:{
      nombre: nombre,
      primer_apellido: primer_apellido,
      segundo_apellido: segundo_apellido,
      email: email,
      user_id: user_id
    }
  })
}