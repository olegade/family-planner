import { prisma } from "../../core/db.js";

export async function createCalendarFeed(input: {
  familyMemberId: string;
  url: string;
}) {
  return prisma.calendarFeed.create({
    data: {
      familyMemberId: input.familyMemberId,
      url: input.url
    }
  });
}

export async function getFeedsForMember(memberId: string) {
  return prisma.calendarFeed.findMany({
    where: { familyMemberId: memberId },
  });
}