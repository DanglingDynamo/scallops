import { KYCStatus } from "@prisma/client";
import { Request, Response, Router } from "express";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import multer from "multer";
import prisma from "../../prisma";
import { fsStorage } from "../lib/firebase";

const kycRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Upload KYC Documents
kycRouter.post("/", upload.single("file"), async (req: Request, res: Response) => {
  const clerkUserId = req["clerkUserId"];
  if (!clerkUserId) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  const documentType = req.body.type;
  console.log(documentType);

  const document = req.file;
  if (!document) {
    return res.status(400).json({ status: "fail", message: "No File Uploaded" });
  }

  // Upload KYC Documents
  const fsStorageRef = ref(fsStorage, `kyc-documents/${clerkUserId}/${document.originalname}`);
  const fsMetadata = {
    contentType: document.mimetype,
  };

  const uploadTask = await uploadBytes(fsStorageRef, document.buffer, fsMetadata);

  try {
    const documentURL = await getDownloadURL(uploadTask.ref);

    const kycRecord = await prisma.kYCRecord.create({
      data: {
        user: {
          connect: {
            clerkId: clerkUserId,
          },
        },
        documentType,
        documentURL,
        status: KYCStatus.PENDING,
      },
    });

    return res.status(200).json({ status: "success", message: "KYC Document Uploaded", data: kycRecord });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(400).json({ status: "fail", message: "Failed To Upload KYC Document" });
  }

  return res.status(200).json({ status: "success", message: "KYC Document Uploaded" });
});

export default kycRouter;
