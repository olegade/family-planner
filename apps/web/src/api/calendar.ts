export type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  location?: string;
  feedId: string;
};

export async function fetchCalendarEventsForMember(memberId: string) {
  const res = await fetch(
    `http://localhost:3001/family-members/${memberId}/calendar-events`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch calendar events");
  }

  return (await res.json()) as CalendarEvent[];
}