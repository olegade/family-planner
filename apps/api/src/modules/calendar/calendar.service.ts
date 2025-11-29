import { prisma } from "../../core/db.js";
import { icsToJson } from "ics-to-json";

type CalendarEventDto = {
  title: string;
  start: string;
  end: string;
  location?: string;
  feedId: string;
};

function parseIcsDate(raw: string | undefined | null): Date | null {
  if (!raw) return null;

  // Format: 20150124T090000Z (UTC)
  const dtUtc = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/;
  const m1 = raw.match(dtUtc);
  if (m1) {
    const [, y, mo, d, h, mi, s] = m1;
    return new Date(
      Date.UTC(
        Number(y),
        Number(mo) - 1,
        Number(d),
        Number(h),
        Number(mi),
        Number(s)
      )
    );
  }

  // Format: 20111215 (dato uden klokkeslæt)
  const dOnly = /^(\d{4})(\d{2})(\d{2})$/;
  const m2 = raw.match(dOnly);
  if (m2) {
    const [, y, mo, d] = m2;
    // Tolkes som lokal dato
    return new Date(Number(y), Number(mo) - 1, Number(d));
  }

  // Fallback: prøv native Date
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d;

  return null;
}

export async function fetchCalendarEvents(
  familyMemberId: string
): Promise<CalendarEventDto[]> {
  const feeds = await prisma.calendarFeed.findMany({
    where: { familyMemberId },
  });

  console.log("[calendar] feeds for member", familyMemberId, feeds.length);

  const allEvents: CalendarEventDto[] = [];
  const now = new Date();

  for (const feed of feeds) {
    try {
      console.log("[calendar] fetching", feed.url);
      const res = await fetch(feed.url);
      console.log("[calendar] status", res.status);

      const icsText = await res.text();

      // Make ICS safe for decodeURI inside ics-to-json
      const safeIcsText = icsText.replace(
        /%(?![0-9A-Fa-f]{2})/g,
        "%25"
      );

      const parsed = icsToJson(safeIcsText);
      console.log("[calendar] parsed count", parsed.length);

      for (const e of parsed as any[]) {
       const rawStart = e.startDate || e.start || e.dtstart;
        const rawEnd = e.endDate || e.end || e.dtend || rawStart;

        const start = parseIcsDate(rawStart);
        const end = parseIcsDate(rawEnd);

        if (!start || !end) {
        console.warn("[calendar] skipping event with invalid dates", {
            rawStart,
            rawEnd,
        });
        continue;
        }

        // Filtrér gamle events fra
        if (end < now) {
        continue;
        }

        allEvents.push({
        title: e.summary ?? "(no title)",
        start: start.toISOString(),
        end: end.toISOString(),
        location: e.location,
        feedId: feed.id,
        });
        }
    } catch (err) {
      console.error("[calendar] Failed to fetch ICS feed:", feed.url, err);
    }
  }

  // Optional: sort by start time ascending
  allEvents.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return allEvents;
}