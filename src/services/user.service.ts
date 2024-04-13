import prisma from "../../prisma";

export async function getUserWithStoreByUserId(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      store: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: { firstName?: string; lastName?: string; email: string; passwordHash: string }) {
  return await prisma.user.create({
    data,
  });
}
