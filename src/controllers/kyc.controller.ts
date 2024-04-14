import { KYCStatus } from "@prisma/client";
import { Request, Response } from "express";
import { createKYCRecord, getKYCRecord, getPendingKYCRequests, updateKYCRecordStatus } from "../services/kyc.service";
import uploadToFirebase from "../utils/uploadToFirebase";

export async function uploadKYCDocument(req: Request, res: Response) {
  const userId = req["userId"];
  if (!userId) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  const documentType = req.body.type;
  if (!documentType) {
    return res.status(400).json({ status: "fail", message: "Document Type Required" });
  }

  const document = req.file;
  if (!document) {
    return res.status(400).json({ status: "fail", message: "No File Uploaded" });
  }

  // Upload KYC Documents
  let documentURL: string | null;
  try {
    documentURL = await uploadToFirebase(`kyc-documents/${userId}/${document.originalname}`, document);
  } catch (error) {
    return res.status(400).json({ status: "fail", message: "Failed To Upload KYC Document" });
  }

  try {
    await createKYCRecord(userId, documentType, documentURL);
    return res.status(200).json({ status: "success", message: "KYC Document Uploaded" });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(409).json({ status: "fail", message: "Failed To Upload KYC Document" });
  }
}

export async function listPendingKYCRequests(req: Request, res: Response) {
  const { page } = req.query;

  try {
    const kycRequests = await getPendingKYCRequests(parseInt(page as string) || 1);
    return res.status(200).json({ status: "success", message: "Pending KYC Requests Fetched", data: kycRequests });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(400).json({ status: "fail", message: "Failed To Get KYC Requests" });
  }
}

export async function approveKYCRequest(req: Request, res: Response) {
  const { kycRecordId } = req.params;

  try {
    await updateKYCRecordStatus(kycRecordId, KYCStatus.APPROVED);
    return res.status(200).json({ status: "success", message: "KYC Request Approved" });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(400).json({ status: "fail", message: "Failed To Approve KYC Request" });
  }
}

export async function rejectKYCRequest(req: Request, res: Response) {
  const { kycRecordId } = req.params;

  try {
    await updateKYCRecordStatus(kycRecordId, KYCStatus.REJECTED);
    return res.status(200).json({ status: "success", message: "KYC Request Rejected" });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(400).json({ status: "fail", message: "Failed To Reject KYC Request" });
  }
}

export async function getKYCStatus(req: Request, res: Response) {
  const userId = req["userId"];
  if (!userId) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  try {
    const kycRecord = await getKYCRecord(userId);
    if (!kycRecord) {
      return res.status(404).json({ status: "fail", message: "KYC Record Not Found" });
    }

    return res.status(200).json({
      status: "success",
      message: "KYC Status Fetched",
      data: {
        status: kycRecord.status,
      },
    });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(400).json({ status: "fail", message: "Failed To Get KYC Status" });
  }
}
