/*
  Warnings:

  - Added the required column `order_type` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('ONDC', 'LOCAL');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'ONLINE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "order_type" "OrderType" NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "receipt" TEXT NOT NULL,
    "orderID" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL,
    "is_dispersed" BOOLEAN NOT NULL,
    "type" "PaymentType" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderID_key" ON "Payment"("orderID");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
