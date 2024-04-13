import { Router } from "express";
import multer from "multer";
import { approveKYCRequest, getKYCStatus, listPendingKYCRequests, uploadKYCDocument } from "../controllers/kyc.controller";
import verifyRoot from "../middleware/verifyRoot";

const kycRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Upload KYC Documents
kycRouter.post("/", upload.single("file"), uploadKYCDocument);

// Get Pending KYC Requests - Works Only For Root
kycRouter.get("/", verifyRoot, listPendingKYCRequests);

// Approve KYC Request - Works Only For Root
kycRouter.patch("/:kycRecordId/approve", verifyRoot, approveKYCRequest);

// Get User KYC Status
kycRouter.get("/status", getKYCStatus);

export default kycRouter;
