import { Store } from "@prisma/client";
import { Request, Response } from "express";
import { createLocalOrder, createONDCOrder } from "../services/orders.services";
import { findStore, findStoreByUser } from "../services/store.service";
import {
    createLocalPayment,
    createONDCPayment,
} from "../services/payment.service";
import { toJSON } from "../utils/dtoToResp";

export interface ONDCOrderPayload {
    customerName: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    buyerSideHook: string;
}

export interface LocalOrderPayload {
    customerName: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    paymentType: "CASH" | "ONLINE";
}

export async function placeOrder(req: Request, res: Response) {
    try {
        const storeID = req.body.storeID;

        let store: Store | null = null;
        try {
            store = await findStore(storeID);
        } catch (error) {
            return res.status(500).send("Internal server error");
        }

        if (!store) {
            return res.status(400).send("Store not found");
        }

        // Place order logic here
        const orderPayload: ONDCOrderPayload = req.body;
        const order = await createONDCOrder(store, orderPayload);

        let total_cost = 0;

        order.products.forEach((orderProduct) => {
            total_cost +=
                +orderProduct.quantity.toString() * orderProduct.product.price;
        });

        const link = await createONDCPayment(total_cost, order.id, order.buyer);

        return res.status(200).send({
            status: "success",
            data: {
                order: JSON.parse(toJSON(order)),
                payment_link: link,
            },
            message: "Order placed successfully",
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "error", message: "some error occured" });
    }
}

export async function placeOrderLocal(req: Request, res: Response) {
    try {
        const userID = req["userId"];

        let store: Store | null = null;
        store = await findStoreByUser(userID);

        if (!store) {
            return res
                .status(404)
                .json({ status: "fail", data: { store: "Store not found" } });
        }

        const orderPayload: LocalOrderPayload = req.body;
        const order = await createLocalOrder(store, orderPayload);

        let total_cost = 0;

        order.products.forEach((orderProduct) => {
            total_cost +=
                +orderProduct.quantity.toString() * orderProduct.product.price;
        });

        const orderId = await createLocalPayment(
            total_cost,
            order.id,
            orderPayload.paymentType,
        );

        return res.status(200).json({
            status: "success",
            message: "order placed successfully",
            data: { order: JSON.parse(toJSON(order)), payOrderId: orderId },
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "error", message: "some error occured" });
    }
}
