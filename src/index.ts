import dotenv from "dotenv";
import express, { Request, Response } from "express";
import verifyJWT from "./middleware/verifyJWT";
import kycRouter from "./routes/kyc.router";
import { storeRouter } from "./routes/storeRouter";
import { loadConstants } from "./constants";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

declare global {
    namespace Express {
        interface Request {
            clerkUserId?: string;
        }
    }
}

loadConstants();

app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
    return res.send({ status: "success", message: "pong!" });
});

app.use("/api/v1/kyc", verifyJWT, kycRouter);

app.use("/api/v1/", storeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
