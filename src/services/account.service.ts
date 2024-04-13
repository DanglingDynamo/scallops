import { Account } from "@prisma/client";
import prisma from "../../prisma";

export default interface AccountService {
    addAccount(account: Account): Promise<void>;
}

export default class PostgresAccount implements AccountService {
    async addAccount(account: Account) {
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
}
