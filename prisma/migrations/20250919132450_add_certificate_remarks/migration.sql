-- CreateTable
CREATE TABLE "public"."CertificateRemark" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "authorRole" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateRemark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CertificateRemark" ADD CONSTRAINT "CertificateRemark_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."CertificateSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
