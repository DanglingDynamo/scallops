import { Product } from "@prisma/client";
import prisma from "../../prisma";

export async function addProduct(product: Product) {
    try {
        await prisma.product.create({
            data: {
                store: {
                    connect: {
                        id: product.storeID,
                    },
                },
                name: product.name,
                amount: product.amount,
                price: product.price,
                image: product.image,
                description: product.description,
                barcode: product.barcode,
            },
        });
    } catch (error) {
        throw error;
    }
}
