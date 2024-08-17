import { Dias, Modalidad } from "@prisma/client";
import prisma from "prisma/client";
import { Matricula } from "~/types/horarioTypes";

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

export const getMatriculasByHorario = async (horario_id:number) =>{
  return await prisma.matricula.findMany({
    where:{horario_id:horario_id,active:true},
    select:{
      aula: true,
      matricula_id:true,
      dia: true,
      curso: true,
      hora_inicio: true,
      hora_final: true
    }
  })
}

export const filterMatriculas = async (horario_id: number, dia:Dias, id_plan_estudio?: number, ubicacion?:string) => {
  return await prisma.matricula.findMany({
    where: {
      horario_id: horario_id,
      curso: {
        plan_id: id_plan_estudio,
        ubicacion:ubicacion,
      },
      dia: dia,
      NOT:{
        modalidad: "VIRTUAL"
      }
    },
    select: {
      matricula_id: true,
      dia:true,
      hora_inicio: true,
      hora_final: true,
      curso:true,
      aula:true,
      modalidad: true
    }
  });
}

export const getVirtualMatriculas = async (horario_id: number) => {
  return await prisma.matricula.findMany({
    where: {
      horario_id: horario_id,
      modalidad: "VIRTUAL"
    },
    select: {
      matricula_id: true,
      dia:true,
      hora_inicio: true,
      hora_final: true,
      curso:true,
      aula:true,
      modalidad:true
    }
  });
}


export const getMatriculaById = async (matricula_id:number) =>{
  return await prisma.matricula.findUnique({
    where:{matricula_id: matricula_id}
  })
}

export const createMatricula = async(hora_inicio:number,
                                    hora_final:number,
                                    dia:Dias,
                                    curso_id:number,
                                    aula_id:number,
                                    horario_id:number,
                                    profesor_id:number,
                                    modalidad: Modalidad,
                                    laboratorio_movil_id?:number|null,
                                    )=>{
  await prisma.matricula.create({
    data:{
      hora_inicio:hora_inicio,
      hora_final:hora_final,
      dia:dia,
      curso_id:curso_id,
      aula_id:aula_id,
      horario_id:horario_id,
      laboratorio_movil_id:laboratorio_movil_id,
      profesor_id:profesor_id,
      modalidad:modalidad
    }
  });


}

export const updateMatricula = async(matricula_id:number,
                                    curso_id:number,
                                    horario_id:number,
                                    profesor_id:number,
                                    laboratorio_movil_id?:number | null
                                    )=>{
  return await prisma.matricula.update({
    where:{matricula_id:matricula_id},
    data:{
      curso_id:curso_id,
      horario_id:horario_id,
      laboratorio_movil_id:laboratorio_movil_id,
      profesor_id:profesor_id
    }
  })
}

export const removeMatricula = async(matricula_id:number) =>{
  return await prisma.matricula.delete({
    where:{matricula_id:matricula_id}
  })
}

export const getLockedTimesByHorarioDay = async (horario_id:number,dia?:Dias) => {
  return await prisma.matricula.findMany({
    where:{
      NOT:{
        modalidad: "VIRTUAL"
      },
      horario_id: horario_id,
      dia:dia
    },
    select:{
      dia:true,
      aula_id:true,
      hora_inicio: true,
      hora_final: true,
      horario_id: true
    }
  });
};