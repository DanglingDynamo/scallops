import prisma from "../../prisma";

export async function getProducts(storeId: string, page: number) {
  return await prisma.product.findMany({
    where: { storeID: storeId },
    take: 10,
    skip: (page - 1) * 10,
  });
}

export async function createProduct(storeId: string, name: string, description: string, price: number, quantity: number, image: string, barcode: number) {
  return await prisma.product.create({
    data: { storeID: storeId, name, description, price, quantity, image, barcode },
  });
}

export async function deleteProduct(productId: string) {
  return await prisma.product.delete({
    where: { id: productId },
  });
}
