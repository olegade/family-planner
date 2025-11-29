// src/CalendarEventsPanel.tsx
import { useEffect, useState } from "react";
import {
  fetchCalendarEventsForMember,
  type CalendarEvent,
} from "./api/calendar.js";

type Props = {
  memberId: string;
};

export function CalendarEventsPanel({ memberId }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCalendarEventsForMember(memberId);
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load calendar events");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [memberId]);

  if (loading) return <p className="text-sm text-slate-500">Loading calendar…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (events.length === 0) {
    return <p className="text-sm text-slate-500">No calendar events.</p>;
  }

  return (
    <div className="mt-4 space-y-2 text-sm">
      {events.map((ev, idx) => (
        <div key={idx} className="rounded-md bg-slate-50 px-3 py-2">
          <div className="font-medium">{ev.title}</div>
          <div className="text-xs text-slate-600">
            {new Date(ev.start).toLocaleString()} →{" "}
            {new Date(ev.end).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {ev.location ? ` @ ${ev.location}` : ""}
          </div>
        </div>
      ))}
    </div>
  );
}