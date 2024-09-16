import prisma from "prisma/client";

export const getPlanById = async (id_plan_estudio: number) => {
  return await prisma.planEstudio.findUnique({
    where: { id_plan_estudio },
  });
};

export const getPlanes = async () => {
  return await prisma.planEstudio.findMany({
    select:{
      nombre_plan: true,
      id_plan_estudio: true
    }
  });
};

export const createPlan = async (nombre:string,codigo:string,user_id:number) => {
  return await prisma.planEstudio.create({
    data:{
      usuario_id: user_id,
      nombre_plan: nombre,
      codigo: codigo
    },
  });
};

export const removePlan = async (plan_id : number) => {
  return await prisma.planEstudio.delete({
    where: {
      id_plan_estudio: plan_id
    }
  });
}

export const updatePlan = async (idPlan: number, name:string, codigoPlan:string) =>{
  return await prisma.planEstudio.update({
    where:{id_plan_estudio: idPlan},
    data:{
      nombre_plan: name,
      codigo: codigoPlan
    }
  })
}

export const getPlansByUserId = async (user_id: number)=> {
  return prisma.planEstudio.findMany({
    where:{
      usuario_id: user_id
    },
    select:{
      nombre_plan: true,
      id_plan_estudio: true
    }
  })
}
