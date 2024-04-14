import { Router } from "express";
import { addProduct, listProducts } from "../controllers/product.controller";
import { deleteProduct } from "../services/product.service";

export const productRouter = Router();

// Get all products for a store
productRouter.get("/", listProducts);

// Add a product to a store
productRouter.post("/", addProduct);

// Delete a product from a store
productRouter.delete("/:productId", deleteProduct);
