import prisma from "prisma/client";
import { TimeSpan, TimeSpans } from "~/types/horarioTypes";
import { getCourseById } from "./courseModel";
import { getGroupByMatricula } from "./groupModel";

export const getMatriculas = async () => {
  return await prisma.matricula.findMany({
    select: {
      time_spans: {
        select: {
          aula: true,
          dia: true,
          hora_inicio: true,
          hora_final: true
        }
      },
      group: {
        select: {
          curso: true,
        }
      },
      matricula_id: true,
    }
  });
};

export const getMatriculasByHorario = async (horario_id: number) => {
  return await prisma.matricula.findMany({
    where: { horario_id: horario_id, active: true },
    select: {
      time_spans: {
        select: {
          hora_inicio: true,
          hora_final: true,
          aula_id: true,
          dia: true
        }
      },
      group: {
        select: {
          curso: true,
        }
      },
      matricula_id: true,
    }
  })
}

export const filterMatriculas = async (horario_id: number, dia: string, id_plan_estudio?: number, ubicacion?: string) => {
  return await prisma.matricula.findMany({
    where: {
      horario_id: horario_id,
      group: {
        curso: {
          plan_id: id_plan_estudio,
          ubicacion: ubicacion,
        }
      },
      time_spans: {
        every: {
          dia: dia
        }
      },
      NOT: {
        modalidad: "VIRTUAL"
      }
    },
    select: {
      matricula_id: true,
      time_spans: {
        select: {
          dia: true,
          hora_inicio: true,
          hora_final: true,
          aula: true
        }
      },
      group: {
        select: {
          groupNumber: true,
          group_id: true,
          curso: true
        }
      },
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
      time_spans: {
        select: {
          dia: true,
          hora_inicio: true,
          hora_final: true,
          aula: true,
        }
      },
      group: {
        select: {
          group_id: true,
          groupNumber: true,
          curso: true,
        }
      },
      modalidad: true
    }
  });
}


export const getMatriculaById = async (matricula_id: number) => {
  return await prisma.matricula.findUnique({
    where: { matricula_id: matricula_id },
    select: {
      matricula_id: true,
      fecha_modificado: true,
      modalidad: true,
      laboratorio_movil: true,
      time_spans: true,
      color: true,
      user_id: true,
      user: true,
      group: {
        include: {
          curso: true,
          profesor: true
        }
      },
    }
  })
}

export const createMatricula = async (
  course_id: number,
  time_spans: TimeSpan[],
  horario_id: number,
  modalidad: string,
  profesor_id: number,
  grupo: number,
  color: string,
  user_id: number,
  laboratorio_movil_id?: number | null) => {
  return prisma.$transaction(async (tx) => {
    try {
      const matricula = await tx.matricula.create({
        data: {
          horario_id: horario_id,
          modalidad: modalidad,
          color: color.slice(1,7),
          user_id: user_id,
          laboratorio_movil_id: laboratorio_movil_id,
        }
      }).then((r) => {
        return r;
      })

      const queryfiedTimesSpansBK: TimeSpans = time_spans.map(t => {
        return {
          matricula_id: matricula.matricula_id,
          aula_id: t.aula_id,
          dia: t.dia,
          hora_inicio: t.hora_inicio,
          hora_final: t.hora_final,
          type: t.type
        }
      })

      const queryfiedTimesSpans: TimeSpans = queryfi(time_spans, matricula);

      if (queryfiedTimesSpans) {
        await tx.time_span.createMany({
          data: queryfiedTimesSpans
        }).then((r) => {
          return r;
        })
      }

      let hoursToAllocate: number = 0;

      time_spans.map(t => {
        let hoursPerT = Number(t.hora_final) - Number(t.hora_inicio);
        hoursToAllocate += hoursPerT;
      })

      const course = await getCourseById(course_id);

      let Ahours = Number(course?.horas) - hoursToAllocate

      if (Ahours >= 0) {
        let completed = !Ahours
        const group = await tx.group.create({
          data: {
            groupNumber: grupo,
            matricula_id: matricula.matricula_id,
            course_id: course_id,
            Ahours: Ahours,
            profesor_id: profesor_id,
            completed: completed,
          }
        }).then((r) => {
          return r;
        }).catch(e => {
          if (e.code === "P2002") {
            throw `The course ${course?.nombre} with group number:${grupo} already exists!`
          } else {
            throw e
          }
        })
      } else {
        console.error("ILLEGAL_TIME_ALLOCATION");
        throw new Error("ILLEGAL_TIME_ALLOCATION");
      }
    } catch (error) {
      throw error;
    }
  });
}

export const updateMatricula = async (
  time_spans: TimeSpan[],
  matricula_id: number,
  profesor_id: number,
  color: string,
  laboratorio_movil_id?: number | null) => {
  return await prisma.$transaction(async (tx) => {
    const queryfiedTimesSpans: TimeSpans = queryfi(time_spans, matricula_id);
    let hoursToAllocate: number = 0;

    time_spans.map(t => {
      let hoursPerT = Number(t.hora_final) - Number(t.hora_inicio);
      hoursToAllocate += hoursPerT;
    })

    if (queryfiedTimesSpans) {
      await tx.time_span.createMany({
        data: queryfiedTimesSpans,
      }).catch(e => { throw new Error(e) })
    }
    const group = (await getGroupByMatricula(matricula_id).catch(e => { throw new Error(e) }))[0]
    const Ahours = group.Ahours;
    const neoAhours = Ahours - hoursToAllocate;

    if (neoAhours >= 0) {
      await tx.group.updateMany({
        where: {
          matricula_id: matricula_id
        },
        data: {
          profesor_id: profesor_id,
          completed: !!neoAhours ? false : true,
          Ahours: !!neoAhours ? neoAhours : 0,
        }
      }).catch(e => { throw new Error(e) })
    } else {
      throw new Error("ILLEGAL_TIME_ALLOCATION");
    }

    const formattedColor = color.slice(1,7);

    await tx.matricula.update({
      where: { matricula_id: matricula_id },
      data: {
        laboratorio_movil_id: laboratorio_movil_id,
        color: formattedColor
      }
    }).catch(e => { throw new Error(e) })

  })
}

export const removeMatriculaOld = async (matricula_id: number) => {
  return await prisma.matricula.delete({
    where: { matricula_id: matricula_id }
  }).catch(e => {
    console.error(e);
  })
}

export const removeMatricula = async (matricula_id: number) => {
  return prisma.$transaction(async (tx) => {
    await tx.time_span.deleteMany({
      where: {
        matricula_id: matricula_id
      }
    }).catch(e => {
      console.error(e);
    })

    await tx.group.delete({
      where: { matricula_id: matricula_id }
    }).catch(e => {
      console.error(e);
    })

    await tx.matricula.delete({
      where: { matricula_id: matricula_id }
    }).catch(e => {
      console.error(e);
    })

  })

}

export const getLockedTimesByHorarioDay = async (horario_id: number, dia?: string) => {
  return await prisma.matricula.findMany({
    where: {
      NOT: {
        modalidad: "VIRTUAL"
      },
      horario_id: horario_id,
      time_spans: {
        every: {
          dia: dia
        }
      }
    },
    select: {
      time_spans: {
        select: {
          dia: true,
          aula_id: true,
          hora_inicio: true,
          hora_final: true,
        }
      },
      horario_id: true
    }
  });
};

function queryfi(time_spans: TimeSpan[], matricula: any | number): TimeSpans {
  return time_spans.map(t => {
    return {
      matricula_id: typeof matricula === "number" ? matricula : matricula.matricula_id,
      aula_id: t.aula_id,
      dia: t.dia,
      hora_inicio: t.hora_inicio,
      hora_final: t.hora_final,
      type: t.type
    }
  })
}

export function getColorByMatriculaId(matricula_id:number){
  return prisma.matricula.findUnique({
    where: {
      matricula_id: matricula_id
    },
    select:{
      matricula_id: true,
      color: true
    }
  })
}

export function getMatriculaModalidad(matricula_id:number){
  return prisma.matricula.findUnique({
    where:{
      matricula_id: matricula_id
    },
    select:{
      modalidad: true
    }
  })
}