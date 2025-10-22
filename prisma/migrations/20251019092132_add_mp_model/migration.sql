-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "mpId" INTEGER;

-- CreateTable
CREATE TABLE "public"."MP" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "district" TEXT,
    "party" TEXT,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MP_email_key" ON "public"."MP"("email");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_mpId_fkey" FOREIGN KEY ("mpId") REFERENCES "public"."MP"("id") ON DELETE SET NULL ON UPDATE CASCADE;
