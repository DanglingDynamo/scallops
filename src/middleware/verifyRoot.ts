import { NextFunction, Request, Response } from "express";
import { SCALLOPS_ROOT_TOKEN } from "../constants";

export default async function verifyRoot(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const aat = req.headers["x-aat"];
    if (typeof aat !== "string") {
        return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    if (aat !== SCALLOPS_ROOT_TOKEN) {
        return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    next();
}
