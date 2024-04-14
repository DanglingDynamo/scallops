import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);

export default authRouter;
