import { Request, Response } from "express";
import { addStore, findStore } from "../services/store.service";

export default class StoreController {
  async addStore(req: Request, res: Response) {
    try {
      const userID = req.clerkUserId;
      if (!userID) {
        res.status(401).json({ status: "fail", message: "user not signed in" });
      }

      const exists = (await findStore(req.clerkUserId)) ? true : false;

      if (exists) {
        return res.status(409).json({ status: "fail", data: { store: "store already exists" } });
      }
      const storeID = await addStore(req.body.name, userID);
      return res.status(200).json({
        status: "success",
        message: "store created succesfully",
        data: { storeId: storeID },
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", message: "internal server error" });
    }
  }
}
