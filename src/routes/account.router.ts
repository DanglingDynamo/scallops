import { Router } from "express";
import AccountController from "../controllers/account.controller";
import verifyJWT from "../middleware/verifyJWT";

const accountController = new AccountController();
export const accountRouter = Router();
accountRouter.use(verifyJWT);

accountRouter.post("/", accountController.addAccount);
