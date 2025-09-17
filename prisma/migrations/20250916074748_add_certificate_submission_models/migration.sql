-- CreateTable
CREATE TABLE "public"."CertificateSubmission" (
    "id" SERIAL NOT NULL,
    "title" "public"."CertificateTitle" NOT NULL,
    "semester" "public"."Semester" NOT NULL DEFAULT 'FIRST',
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CertificateFile" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CertificateSubmission" ADD CONSTRAINT "CertificateSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CertificateFile" ADD CONSTRAINT "CertificateFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."CertificateSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
