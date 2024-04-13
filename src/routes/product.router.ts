import { Router } from "express";
import { addProduct, listProducts } from "../controllers/product.controller";
import { deleteProduct } from "../services/product.service";
import multer from "multer";

export const productRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Get all products for a store
productRouter.get("/", listProducts);

// Add a product to a store
productRouter.post("/", upload.single("file"), addProduct);

// Delete a product from a store
productRouter.delete("/:productId", deleteProduct);

