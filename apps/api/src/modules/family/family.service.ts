import { prisma } from "../../core/db.js";

export async function listFamilyMembers() {
  return prisma.familyMember.findMany({
    orderBy: { createdAt: "asc" }
  });
}

export type CreateFamilyMemberInput = {
  name: string;
  role: "PARENT" | "CHILD";
  color?: string | null;
};

// Service function that creates a new family member
export async function createFamilyMember(input: CreateFamilyMemberInput) {
  const { name, role, color } = input;

  return prisma.familyMember.create({
    data: {
      name,
      role,
      color: color ?? null
    }
  });
}

export async function deleteFamilyMember(id: string) {
  return prisma.familyMember.delete({
    where: { id }
  });
}