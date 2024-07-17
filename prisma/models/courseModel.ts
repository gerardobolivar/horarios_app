import prisma from "prisma/client";

export const getCourseById = async (id_curso: number) => {
  return await prisma.curso.findUnique({
    where: { id_curso },
  });
};

export const getCourses = async () => {
  return await prisma.curso.findMany({
    select:{
      nombre: true,
      id_curso: true
    }
  });
};

export const getCoursesbyPlan = async (plan_id:number) => {
  return await prisma.curso.findMany({
    where:{plan_id},
    select:{
      nombre: true,
      sigla: true,
      id_curso: true
    }
  });
};

export const createCourse = async (nombre:string,sigla:string,plan_id:number,horas: string,tipoCurso:string) => {
  return await prisma.curso.create({
    data:{
      nombre: nombre,
      sigla: sigla,
      plan_id: plan_id,
      horas:horas,
      tipoCurso: tipoCurso
    },
  });
};

export const removeCourse = async (id_curso : number) => {
  return await prisma.curso.delete({
    where: {
      id_curso: id_curso
    }
  });
}

export const updateCourse = async (id_curso:number,nombre:string,sigla:string,horas: string,tipoCurso:string) =>{
  return await prisma.curso.update({
    where:{id_curso: id_curso},
    data:{
      nombre:nombre,
      sigla:sigla,
      horas:horas,
      tipoCurso: tipoCurso
    }
  })
}