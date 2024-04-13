import { Request, Response } from "express";

async function addAccount(req: Request, res: Response) {
    try {
        const currBalance = parseInt(req.body.currBalance);
        res
            .status(500)
            .json({ status: "success", message: "account created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "internal server error" });
    }
}
