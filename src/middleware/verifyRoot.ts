import { NextFunction, Request, Response } from "express";

const SCALLOPS_ROOT_TOKEN = process.env.SCALLOPS_ROOT_TOKEN;
if (!SCALLOPS_ROOT_TOKEN) {
  throw new Error("Environment variable JWT_SECRET must be set.");
}

export default async function verifyRoot(req: Request, res: Response, next: NextFunction) {
  const aat = req.headers["x-aat"];
  if (typeof aat !== "string") {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  if (aat !== SCALLOPS_ROOT_TOKEN) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  next();
}
