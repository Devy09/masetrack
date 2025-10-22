/*
  Warnings:

  - You are about to drop the column `addedById` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_addedById_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "addedById";

-- CreateTable
CREATE TABLE "public"."Grantee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "image" TEXT,
    "userId" INTEGER NOT NULL,
    "addedById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grantee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grantee_userId_key" ON "public"."Grantee"("userId");

-- AddForeignKey
ALTER TABLE "public"."Grantee" ADD CONSTRAINT "Grantee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Grantee" ADD CONSTRAINT "Grantee_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
