import { Store } from "@prisma/client";
import { Request, Response } from "express";
import { createOrder } from "../services/orders.services";
import { findStore } from "../services/store.service";

export interface OrderPayload {
  customerName: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  buyerSideHook: string;
}

export async function placeOrder(req: Request, res: Response) {
  const userId = req["userId"];
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  let store: Store | null = null;
  try {
    store = await findStore(userId);
  } catch (error) {
    return res.status(500).send("Internal server error");
  }

  if (!store) {
    return res.status(400).send("Store not found");
  }

  // Place order logic here
  const orderPayload: OrderPayload = req.body;
  const order = createOrder(store, orderPayload);

  // TODO: add razorpay link
  // razorpayInit()

  return res.status(200).send({ status: "success", data: order, message: "Order placed successfully" });
}
