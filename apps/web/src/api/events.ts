export type FamilyEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string | null;
  familyMemberId: string;
  familyMember: {
    id: string;
    name: string;
    role: string;
    color?: string | null;
  };
};

const API_URL = "http://localhost:3001";

export async function fetchEvents(): Promise<FamilyEvent[]> {
  const res = await fetch(`${API_URL}/family-events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export type CreateEventInput = {
  title: string;
  start: string;
  end: string;
  location?: string;
  familyMemberId: string;
};

export async function createEvent(input: CreateEventInput): Promise<FamilyEvent> {
  const res = await fetch(`${API_URL}/family-events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to create event: ${msg}`);
  }

  return res.json();
}