import { Request, Response } from "express";
import { addAccount, findAccount } from "../services/account.service";
import { v4 as uuidv4 } from "uuid";
import { findStore } from "../services/store.service";

export default class AccountController {
    async addAccount(req: Request, res: Response) {
        try {
            const store = await findStore(req.clerkUserId);

            if (!store) {
                return res.status(404).json({
                    status: "fail",
                    data: { store: "user does not have a store " },
                });
            }

            const storeID = store.id;

            const exists = (await findAccount(String(storeID))) ? true : false;
            if (exists) {
                return res.status(409).json({
                    status: "fail",
                    data: { account: "account already exists " },
                });
            }

            const currBalance = parseInt(req.body.curr_balance);
            if (isNaN(currBalance)) {
                res
                    .status(422)
                    .json({ status: "fail", data: { curr_balance: "not a number" } });
            }

            const accountNumber = parseInt(req.body.account_number);
            if (isNaN(accountNumber)) {
                res
                    .status(422)
                    .json({ status: "fail", data: { curr_balance: "not a number" } });
            }

            const account = await addAccount({
                balance: currBalance,
                beneficiary: String(req.body.beneficiary),
                ifsc_code: String(req.body.ifsc_code),
                account_number: BigInt(accountNumber),
                id: uuidv4(),
                storeID: String(storeID),
                branch: String(req.body.branch),
                bank_name: String(req.body.bank_name),
                createdAt: new Date(),
                updatedAt: null,
            });

            return res.status(500).json({
                status: "success",
                message: "account created successfully",
                data: { account: account },
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ status: "fail", message: "internal server error" });
        }
    }
}
