export type FamilyMember = {
  id: string;
  name: string;
  role: "PARENT" | "CHILD";
  color: string | null;
  createdAt: string;
  updatedAt: string;
};

const API_URL = "http://localhost:3001";

export async function fetchFamilyMembers(): Promise<FamilyMember[]> {
  const response = await fetch(`${API_URL}/family-members`);
  if (!response.ok) {
    throw new Error("Failed to load family members");
  }
  return response.json();
}

export type CreateFamilyMemberInput = {
  name: string;
  role: "PARENT" | "CHILD";
  color?: string;
};

export async function createFamilyMember(
  input: CreateFamilyMemberInput
): Promise<FamilyMember> {
  const response = await fetch(`${API_URL}/family-members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Failed to create family member");
  }

  return response.json();
}

export async function deleteFamilyMember(
  id: string
): Promise<void> {
  const response = await fetch(`${API_URL}/family-members/${id}`, {
    method: "DELETE"
  });

 if (!response.ok && response.status !== 404) {
    throw new Error("Failed to delete family member");
  }
}