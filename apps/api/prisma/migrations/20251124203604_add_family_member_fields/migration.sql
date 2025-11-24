/*
  Warnings:

  - Added the required column `name` to the `FamilyMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `FamilyMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FamilyMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FamilyRole" AS ENUM ('PARENT', 'CHILD');

-- AlterTable
ALTER TABLE "FamilyMember" ADD COLUMN     "color" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "role" "FamilyRole" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
