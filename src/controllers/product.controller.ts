import { Request, Response } from "express";
import { createProduct, deleteProduct, getProducts } from "../services/product.service";
import { getUserWithStoreByUserId } from "../services/user.service";
import uploadToFirebase from "../utils/uploadToFirebase";

export async function listProducts(req: Request, res: Response) {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;

  const clerkUserId = req["clerkUserId"];
  if (!clerkUserId) {
    return res.status(403).send({ status: "fail", message: "Unauthorized" });
  }

  const user = await getUserWithStoreByUserId(clerkUserId);
  if (!user) {
    return res.status(404).send({ status: "fail", message: "User not found" });
  }

  if (!user.store) {
    return res.status(404).send({ status: "fail", message: "Store not found" });
  }

  try {
    const products = await getProducts(user.store.id, page);
    return res.send({ status: "success", message: "Fetched Products", data: products });
  } catch (error) {
    console.error(`error: ${error}`);
    return res.status(500).send({ status: "fail", message: "Error fetching products" });
  }
}

export async function addProduct(req: Request, res: Response) {
  const image = req.file;
  if (!image) {
    return res.status(400).send({ status: "fail", message: "Image is required" });
  }

  const clerkUserId = req["clerkUserId"];
  if (!clerkUserId) {
    return res.status(403).send({ status: "fail", message: "Unauthorized" });
  }

  const user = await getUserWithStoreByUserId(clerkUserId);
  if (!user) {
    return res.status(404).send({ status: "fail", message: "User not found" });
  }

  if (!user.store) {
    return res.status(404).send({ status: "fail", message: "Store not found" });
  }

  const { name, description, price, quantity, barcode } = req.body;

  if (!name || !description || !price || !quantity || !barcode) {
    return res.status(400).send({ status: "fail", message: "All fields are required" });
  }

  const imageURL = await uploadToFirebase(`products/${clerkUserId}/${image.originalname}`, image);

  try {
    const product = await createProduct(user.store.id, name, description, parseInt(price), parseInt(quantity), imageURL, barcode);
    return res.send({ status: "success", message: "Product added successfully", data: product });
  } catch (error) {
    console.error(`error: ${error}`);
    return res.status(500).send({ status: "fail", message: "Error creating product" });
  }
}

export async function removeProduct(req: Request, res: Response) {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).send({ status: "fail", message: "Product ID is required" });
  }

  try {
    await deleteProduct(productId);
    return res.send({ status: "success", message: "Product removed successfully" });
  } catch (error) {
    console.error(`error: ${error}`);
    return res.status(500).send({ status: "fail", message: "Error removing product" });
  }
}
