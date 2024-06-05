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