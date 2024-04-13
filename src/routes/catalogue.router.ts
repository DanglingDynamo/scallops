import express from "express";
import multer from "multer";
import { transcribeVoiceToCatalogueItems } from "../controllers/catalogue.controller";

const catalogueRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Transcribe voice to catalogue items
catalogueRouter.post("/speak", upload.single("file"), transcribeVoiceToCatalogueItems);

export default catalogueRouter;
