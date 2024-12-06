/*
  Warnings:

  - Changed the type of `status` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `SellRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('NEW', 'USED');

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "status",
ADD COLUMN     "status" "CarStatus" NOT NULL;

-- AlterTable
ALTER TABLE "SellRequest" DROP COLUMN "status",
ADD COLUMN     "status" "CarStatus" NOT NULL;
