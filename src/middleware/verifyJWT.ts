import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export default async function verifyJWT(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const authorization = req.headers.authorization;
    const jwt = authorization ? authorization.split(" ")[1] : "";
    try {
        if (authorization == "") {
            return res.status(401).json({
                status: "error",
                data: { header: "authorization header is missing" },
            });
        }
        if (!JWT_SECRET) {
            return res
                .status(500)
                .json({ status: "error", message: "internal server error" });
        }
        const decoded = jsonwebtoken.verify(jwt, JWT_SECRET) as unknown as Record<
            string,
            string
        >;

        if (!decoded) {
            return res.status(401).json({ status: "fail", message: "Unauthorized" });
        }

        //   if (!dbUser?.kycRecord && req.originalUrl !== "/api/v1/kyc") {
        //     return res.status(403).json({
        //       status: "fail",
        //       message: "KYC Not Completed",
        //     });
        //   }

        //   if (PENDING_KYC_STATUSES.includes(dbUser?.kycRecord?.status ?? "")) {
        //     return res.status(202).json({ status: "success", message: "KYC Verification Pending" });
        //   }

        req["userId"] = decoded["userId"];

        next();
    } catch (error) {
        console.log(`error: ${error}`);
        return res.status(400).json({ status: "fail", message: "Invalid Token" });
    }
}
