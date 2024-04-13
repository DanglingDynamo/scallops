import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { loadConstants } from "./constants";
import verifyJWT from "./middleware/verifyJWT";
import { accountRouter } from "./routes/account.router";
import catalogueRouter from "./routes/catalogue.router";
import kycRouter from "./routes/kyc.router";
import productRouter from "./routes/product.router";
import { storeRouter } from "./routes/store.router";
import productRouter from "./routes/product.router";

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
app.use("/api/v1/", accountRouter);
app.use("/api/v1/catalogue", verifyJWT, catalogueRouter);
app.use("/api/v1/product", verifyJWT, productRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
