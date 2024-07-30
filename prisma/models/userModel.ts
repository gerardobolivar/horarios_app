import { UserRole } from "@prisma/client";
import prisma from "prisma/client";

export const getUser = async (id_usuario: number) => {
  return await prisma.user.findUnique({
    where: { id_usuario },
  });
};

export const getUsers = async()=>{
  return await prisma.user.findMany(
  {
    select: {
      id_usuario: true,
      nombre_usuario: true
    }
  }
  )
}

export const removeUsuario = async (id_usuario:number) =>{
  return await prisma.user.delete({
    where:{
      id_usuario: id_usuario
    }
  })
}

export const updateUsuarioRole = async (id_usuario:number, role: UserRole) =>{
  return await prisma.user.update({
    where:{
      id_usuario: id_usuario
    },
    data:{
      role: UserRole[role]
    }
  })
}

export const createUsuario = async (nombre_usuario:string, role:UserRole) =>{
  return await prisma.user.create({
    data:{
      nombre_usuario: nombre_usuario,
      role: role
    }
  })
}