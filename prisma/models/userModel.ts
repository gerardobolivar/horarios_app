import prisma from "prisma/client";

export const getUserById = async (id_usuario: number) => {
  return await prisma.user.findUnique({
    where: { id_usuario },
  });
};