import prisma from "prisma/client";

export const getMatriculas = async () => {
  return await prisma.matricula.findMany({
    select:{
      aula: true,
      matricula_id:true,
      dia: true,
      curso: true,
      hora_inicio: true,
      hora_final: true
    }
  });
};