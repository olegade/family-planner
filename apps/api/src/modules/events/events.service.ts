import { prisma } from "../../core/db.js";

export type ListFamilyEventsOptions = {
  from?: Date;
  to?: Date;
};

export async function listFamilyEvents(options: ListFamilyEventsOptions = {}) {
  const { from, to } = options;

  return prisma.familyEvent.findMany({
    where: {
      ...(from && { start: { gte: from } }),
      ...(to && { end: { lte: to } })
    },
    orderBy: {
      start: "asc"
    },
    include: {
      familyMember: true
    }
  });
}

export type CreateFamilyEventInput = {
  title: string;
  start: Date;
  end: Date;
  location?: string | null;
  familyMemberId: string;
};

export async function createFamilyEvent(input: CreateFamilyEventInput) {
  const { title, start, end, location, familyMemberId } = input;

  return prisma.familyEvent.create({
    data: {
      title,
      start,
      end,
      location: location ?? null,
      familyMemberId
    },
    include: {
      familyMember: true
    }
  });
}