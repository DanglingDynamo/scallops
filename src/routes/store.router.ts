import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import StoreController from "../controllers/store.controller";

const storeController = new StoreController();

export const storeRouter = Router();
storeRouter.use(verifyJWT);

storeRouter.post("/store", storeController.addStore);
