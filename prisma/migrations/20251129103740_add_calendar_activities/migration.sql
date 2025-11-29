-- CreateTable
CREATE TABLE "public"."CalendarActivity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarActivity_date_idx" ON "public"."CalendarActivity"("date");

-- CreateIndex
CREATE INDEX "CalendarActivity_userId_idx" ON "public"."CalendarActivity"("userId");

-- CreateIndex
CREATE INDEX "CalendarActivity_category_idx" ON "public"."CalendarActivity"("category");

-- AddForeignKey
ALTER TABLE "public"."CalendarActivity" ADD CONSTRAINT "CalendarActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
