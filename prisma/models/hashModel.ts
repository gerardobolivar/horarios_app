import prisma from "prisma/client";



export const getHashByUserId = async (id_user:number) =>{
  return await prisma.hash.findUnique({
    where:{
      user_id:id_user
    }
  })
}

export const getSaltByUserId = async (id_user:number) =>{
  return await prisma.hash.findUnique({
    where:{
      user_id:id_user
    },
    select:{
      salt: true
    }
  })
}

export const createHash = async (user_id:number, salt:string, hash:string ) =>{
  return await prisma.$transaction(async (tx)=>{
    
    await tx.hash.create({
      data:{
        user_id: user_id,
        salt: salt,
        hash: hash
      }
    })

    await tx.user.update({
      where:{
        id_usuario:user_id,
      },
      data:{
        resetPassword: false,
      }
    })

  })
}