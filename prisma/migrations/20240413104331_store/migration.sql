-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerID" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "storeID" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "beneficiary" TEXT NOT NULL,
    "ifsc_code" TEXT NOT NULL,
    "account_number" BIGINT NOT NULL,
    "branch" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_ownerID_key" ON "Store"("ownerID");

-- CreateIndex
CREATE UNIQUE INDEX "Account_storeID_key" ON "Account"("storeID");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_storeID_fkey" FOREIGN KEY ("storeID") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
