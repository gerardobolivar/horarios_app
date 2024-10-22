import { redirect } from "@remix-run/react";
import prisma from "prisma/client";
import CryptoSec from "~/.server/Controller/crypto/crypto";

export const getUserById = async (id_usuario: number) => {
  return await prisma.user.findUnique({
    where: { id_usuario },
  });
};

export const userHasHash = async (id_usuario: number):Promise<boolean> => {
  let hashFound = false;

  const user = await prisma.user.findUnique({
    where: { id_usuario },
    select: {hash: true}
  });
  
  if(user?.hash?.id_hash != null){
    hashFound = true;
  }

  return hashFound;
};

export const getUserByName = async (nombre_usuario: string) => {
  return await prisma.user.findUnique({
    where: { nombre_usuario:nombre_usuario}
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

export const updateUsuarioRole = async (id_usuario:number, role: string) =>{
  return await prisma.user.update({
    where:{
      id_usuario: id_usuario
    },
    data:{
      role: role
    }
  })
}

export const createUsuario = async (nombre_usuario:string, role:string) =>{
  return await prisma.user.create({
    data:{
      nombre_usuario: nombre_usuario,
      role: role
    }
  })
}

export const validateUser = async (password:string, username: string) => {
  return prisma.$transaction(async (tx)=>{    


    const user = await tx.user.findUnique({
      where:{
        nombre_usuario: username
      },
      include:{
        hash:{
          select:{
            hash: true
          }
        }
      }
    }).then(user=>user).catch((e)=>{
      throw new Error(e)
    })
    
    if (user) {
      const crp = new CryptoSec();
      const isAutheticaded = await crp.validatePassword(user.id_usuario,password);
      if(isAutheticaded){
        return user.id_usuario;
      }
      return null;

    }else{
      return null;
    }
    
  })
}