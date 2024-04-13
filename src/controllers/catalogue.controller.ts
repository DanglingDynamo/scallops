import { Request, Response } from "express";
import openAIClient from "../lib/open-ai";
import saveToTemporaryDir from "../utils/saveToTemporaryDir";
import fs from "fs";
import translateAudio from "../utils/translateAudio";
import extractInventoryFromTranslation from "../tools/extractInventoryFromTranslation";

export async function transcribeVoiceToCatalogueItems(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ status: "fail", message: "No File Uploaded" });
  }

  let rs: fs.ReadStream | null = null;
  try {
    rs = await saveToTemporaryDir(file);
  } catch (error) {
    return res.status(400).json({ status: "fail", message: "Failed To Save File To Temporary Directory" });
  }

  try {
    const stt = await translateAudio(rs);
    const inventory = await extractInventoryFromTranslation(stt);

    return res.status(200).json({ status: "success", message: "Transcribed Catalogue Items Successfully", data: inventory });
  } catch (error) {
    console.error(`error: ${error}`);
    return res.status(400).json({ status: "fail", message: "Failed To Transcribe Audio" });
  }
}
