import { Router } from "express";
import multer from "multer";
import { approveKYCRequest, listPendingKYCRequests, uploadKYCDocument } from "../controllers/kyc.controller";
import verifyRoot from "../middleware/verifyRoot";

const kycRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Get Pending KYC Requests - Works Only For Root
kycRouter.get("/", verifyRoot, listPendingKYCRequests);

// Upload KYC Documents
kycRouter.post("/", upload.single("file"), uploadKYCDocument);

// Approve KYC Request - Works Only For Root
kycRouter.patch("/:kycRecordId/approve", verifyRoot, approveKYCRequest);

export default kycRouter;
