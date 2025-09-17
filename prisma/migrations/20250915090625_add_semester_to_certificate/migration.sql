-- CreateEnum
CREATE TYPE "public"."Semester" AS ENUM ('FIRST', 'SECOND');

-- AlterTable
ALTER TABLE "public"."Certificate" ADD COLUMN     "semester" "public"."Semester" NOT NULL DEFAULT 'FIRST';
