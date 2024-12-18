import prisma from "prisma/client";

export const getCourseById = async (id_curso: number) => {
  return await prisma.curso.findUnique({
    where: { id_curso },
  });
};

export const getCourses = async () => {
  return await prisma.curso.findMany({
    select: {
      sigla: true,
      nombre: true,
      id_curso: true
    },
    orderBy:[
      {sigla: 'asc'}
    ]
  });
};

export const getCoursesByUserId = async (usuario_id:number) =>{
  return await prisma.curso.findMany({
    where:{
      plan:{
        usuario_id: usuario_id
      },
    },
    select:{
      sigla: true,
      nombre: true,
      id_curso: true
    },
    orderBy:[
      {sigla:'asc'}
    ]
  })
}

export const getCoursesbyPlan = async (plan_id: number) => {
  return await prisma.curso.findMany({
    where: { plan_id },
    select: {
      nombre: true,
      sigla: true,
      id_curso: true
    },
    orderBy:[
      {sigla: 'asc'}
    ]
  });
};

export const createCourse = async (nombre: string, sigla: string, plan_id: number, horas: string, tipoCurso: string,ubicacion:string) => {
  return await prisma.curso.create({
    data: {
      nombre: nombre,
      sigla: sigla,
      plan_id: plan_id,
      horas: horas,
      tipoCurso: tipoCurso,
      ubicacion: ubicacion
    },
  });
};

export const removeCourse = async (id_curso: number) => {
  return await prisma.curso.delete({
    where: {
      id_curso: id_curso
    }
  });
}

export const updateCourse = async (id_curso: number, nombre: string, sigla: string, horas: string, tipoCurso: string, ubicacion:string) => {
  return await prisma.curso.update({
    where: { id_curso: id_curso },
    data: {
      nombre: nombre,
      sigla: sigla,
      horas: horas,
      tipoCurso: tipoCurso,
      ubicacion: ubicacion
    }
  })
}

export const countCoursesById = async (idPlan: number) => {
  return await prisma.curso.count({
    where:{
      plan_id: idPlan
    },
    select: { id_curso: true}
  })
}