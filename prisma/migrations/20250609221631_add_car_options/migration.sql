-- CreateEnum
CREATE TYPE "CarOptionCategory" AS ENUM ('TRANSMISSION', 'TYPE', 'FUEL_TYPE');

-- CreateTable
CREATE TABLE "CarOption" (
    "id" SERIAL NOT NULL,
    "category" "CarOptionCategory" NOT NULL,
    "value" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarOption_value_key" ON "CarOption"("value");

-- CreateIndex
CREATE INDEX "CarOption_category_idx" ON "CarOption"("category");
