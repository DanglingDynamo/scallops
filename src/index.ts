import dotenv from "dotenv";
import express, { Request, Response } from "express";
import verifyJWT from "./middleware/verifyJWT";
import kycRouter from "./routes/kyc-router";

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

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send({ status: "success", message: "Hello World!" });
});

app.use(verifyJWT);
app.use("/api/v1/kyc", kycRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
