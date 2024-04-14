import { OrderType, Store } from "@prisma/client";
import prisma from "../../prisma";
import {
    LocalOrderPayload,
    ONDCOrderPayload,
} from "../controllers/orders.controller";

export const createONDCOrder = async (
    store: Store,
    orderPayload: ONDCOrderPayload,
) => {
    try {
        const order = await prisma.order.create({
            data: {
                buyer: orderPayload.customerName,
                store: {
                    connect: { id: store.id },
                },
                products: {
                    createMany: {
                        data: orderPayload.items.map((item) => ({
                            productID: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
                buyer_side_hook: orderPayload.buyerSideHook,
                order_type: OrderType.ONDC,
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return order;
    } catch (error) {
        throw error;
    }
};

export const createLocalOrder = async (
    store: Store,
    orderPayload: LocalOrderPayload,
) => {
    try {
        const order = await prisma.order.create({
            data: {
                buyer: orderPayload.customerName,
                store: {
                    connect: { id: store.id },
                },
                products: {
                    createMany: {
                        data: orderPayload.items.map((item) => ({
                            productID: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
                order_type: OrderType.ONDC,
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return order;
    } catch (error) {
        throw error;
    }
};
