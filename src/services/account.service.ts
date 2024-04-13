import { Account } from "@prisma/client";
import prisma from "../../prisma";

export async function addAccount(account: Account) {
    try {
        await prisma.account.create({
            data: {
                store: {
                    connect: {
                        id: account.storeID,
                    },
                },
                balance: account.balance,
                beneficiary: account.beneficiary,
                ifsc_code: account.ifsc_code,
                account_number: account.account_number,
                branch: account.branch,
                bank_name: account.bank_name,
            },
        });
    } catch (error) {
        throw error;
    }
}

export async function findAccount(storeID: string) {
    try {
        const account = await prisma.account.findFirst({
            where: {
                storeID: storeID,
            },
        });

        return account;
    } catch (error) {
        throw error;
    }
}
