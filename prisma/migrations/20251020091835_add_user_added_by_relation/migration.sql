/*
  Warnings:

  - You are about to drop the column `mpId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_mpId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "mpId",
ADD COLUMN     "addedById" INTEGER;

-- DropTable
DROP TABLE "public"."MP";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
