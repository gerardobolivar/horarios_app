import { Dias } from "@prisma/client";
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
                                    laboratorio_movil_id:number,
                                    profesor_id:number)=>{
  return await prisma.matricula.create({
    data:{
      hora_inicio:hora_inicio,
      hora_final:hora_final,
      dia:dia,
      curso_id:curso_id,
      aula_id:aula_id,
      horario_id:horario_id,
      laboratorio_movil_id:laboratorio_movil_id,
      profesor_id:profesor_id
    }
  })
}

export const updateMatricula = async(matricula_id:number,
                                    hora_inicio:number,
                                    hora_final:number,
                                    dia:Dias,
                                    curso_id:number,
                                    aula_id:number,
                                    horario_id:number,
                                    laboratorio_movil_id:number,
                                    profesor_id:number)=>{
  return await prisma.matricula.update({
    where:{matricula_id:matricula_id},
    data:{
      hora_inicio:hora_inicio,
      hora_final:hora_final,
      dia:dia,
      curso_id:curso_id,
      aula_id:aula_id,
      horario_id:horario_id,
      laboratorio_movil_id:laboratorio_movil_id,
      profesor_id:profesor_id
    }
  })
}