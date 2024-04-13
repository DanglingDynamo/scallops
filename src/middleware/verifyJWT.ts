import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import prisma from "../../prisma";

const JWT_SECRET = process.env.CLERK_PEM_PUBLIC_KEY;
if (!JWT_SECRET) {
  throw new Error("Environment variable JWT_SECRET must be set.");
}

const SCALLOPS_ROOT_TOKEN = process.env.SCALLOPS_ROOT_TOKEN;
if (!SCALLOPS_ROOT_TOKEN) {
  throw new Error("Environment variable JWT_SECRET must be set.");
}

const PENDING_KYC_STATUSES = ["PENDING", "REJECTED"];

export default async function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const jwt = authorization?.split(" ")?.[1];
  if (!authorization || !jwt) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  const aat = req.headers["x-aat"];

  try {
    if (JWT_SECRET) {
      const decoded = jsonwebtoken.verify(jwt, JWT_SECRET);

      const userId = decoded.sub;
      if (!userId || !(typeof userId === "string")) {
        return res.status(400).json({ status: "fail", message: "Invalid Token" });
      }

      const clerkUser = await clerkClient.users.getUser(userId);
      if (!clerkUser) {
        return res.status(400).json({ status: "fail", message: "Invalid Token" });
      }

      const dbUser = await prisma.user.findUnique({ where: { clerkId: clerkUser.id }, include: { kycRecord: true } });
      if (!dbUser) {
        await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            email: clerkUser.emailAddresses[0].emailAddress,
          },
        });
      }

      if (!dbUser?.kycRecord) {
        if (!(req.path === "/api/v1/kyc" && req.method === "POST")) {
          return res.status(403).json({
            status: "fail",
            message: "KYC Not Completed",
          });
        }
      }

      if (PENDING_KYC_STATUSES.includes(dbUser?.kycRecord?.status || "") && !(aat === SCALLOPS_ROOT_TOKEN)) {
        return res.status(202).json({ status: "success", message: "KYC Verification Pending" });
      }

      req["clerkUserId"] = clerkUser.id;

      next();
    }
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(400).json({ status: "fail", message: "Invalid Token" });
  }
}
