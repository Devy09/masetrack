-- AddForeignKey
ALTER TABLE "public"."CertificateRemark" ADD CONSTRAINT "CertificateRemark_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
