import { Router } from "express";
import { placeOrder, placeOrderLocal } from "../controllers/orders.controller";
import verifyJWT from "../middleware/verifyJWT";

export const orderRouter = Router();

orderRouter.post("/place/seller", placeOrder);
orderRouter.post("/place/local", verifyJWT, placeOrderLocal);
