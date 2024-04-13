import { DocumentType, KYCStatus } from "@prisma/client";
import prisma from "../../prisma";

export async function createKYCRecord(clerkUserId: string, documentType: DocumentType, documentURL: string) {
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

  return kycRecord;
}

export async function getPendingKYCRequests(page: number) {
  const kycRecords = await prisma.kYCRecord.findMany({
    where: {
      status: KYCStatus.PENDING,
    },
    skip: (page - 1) * 10,
    take: 10,
  });

  return kycRecords;
}

export async function updateKYCRecordStatus(kycRecordId: string, status: KYCStatus) {
  const kycRecord = await prisma.kYCRecord.update({
    where: { id: kycRecordId },
    data: { status },
  });

  return kycRecord;
}