import prisma from "../../prisma";

export async function getUserWithStoreByUserId(clerkUserId: string) {
  return await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    include: {
      store: true,
    },
  });
}
