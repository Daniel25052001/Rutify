-- CreateEnum
CREATE TYPE "BusStatus" AS ENUM ('ACTIVE', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "buses" ADD COLUMN     "status" "BusStatus" NOT NULL DEFAULT 'ACTIVE';
