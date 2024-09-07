import prisma from "prisma/client"

export const updateGroup = async (group_id:number, Ahours?:number, profesor_id?:number)=>{
  return await prisma.group.update({
    where:{group_id:group_id},
    data:{
      Ahours:Ahours,
      profesor_id: profesor_id
    }
  })
}

export const updateGroupCompleteness = async (group_id:number, completed:boolean)=>{
  return await prisma.group.update({
    where:{group_id:group_id},
    data:{
      completed: completed
    }
  })
}

export const createGroup = async (course_id:number, matricula_id:number, Ahours: number, profesor_id: number,completed:boolean) => {
  return await prisma.group.create({
    data:{
      course_id: course_id,
      matricula_id: matricula_id,
      Ahours: Ahours,
      profesor_id: profesor_id,
      completed: completed
    }
  })
}

export const deleteGroup = async (group_id: number) => {
  return await prisma.group.delete({
    where:{group_id: group_id}
  })
}

export const getGroup = async (group_id:number) =>{
  return await prisma.group.findUnique({
    where:{
      group_id: group_id
    }
  })
} 