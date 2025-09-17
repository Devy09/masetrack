/*
  Warnings:

  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Certificate" DROP CONSTRAINT "Certificate_userId_fkey";

-- DropTable
DROP TABLE "public"."Certificate";
