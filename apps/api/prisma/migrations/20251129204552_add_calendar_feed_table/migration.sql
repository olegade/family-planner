-- AlterTable
ALTER TABLE "FamilyEvent" ADD COLUMN     "calendarFeedId" TEXT;

-- CreateTable
CREATE TABLE "CalendarFeed" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "familyMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarFeed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarFeed_familyMemberId_idx" ON "CalendarFeed"("familyMemberId");

-- AddForeignKey
ALTER TABLE "CalendarFeed" ADD CONSTRAINT "CalendarFeed_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyEvent" ADD CONSTRAINT "FamilyEvent_calendarFeedId_fkey" FOREIGN KEY ("calendarFeedId") REFERENCES "CalendarFeed"("id") ON DELETE SET NULL ON UPDATE CASCADE;
