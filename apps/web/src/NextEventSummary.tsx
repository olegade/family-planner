import { useEffect, useState } from "react";
import { fetchEvents, type FamilyEvent } from "./api/events.js";
import { fetchFamilyMembers, type FamilyMember } from "./api/family.js";
import { humanizeDate } from "./utils/HumanDate.js";

type NextEvent = {
  member: FamilyMember;
  event?: FamilyEvent;
};

export function NextEventSummary() {
  const [items, setItems] = useState<NextEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const now = new Date();
        const from = now.toISOString();

        const [members, events] = await Promise.all([
          fetchFamilyMembers(),
          fetchEvents({ from })
        ]);

        const nextEventsByMember = new Map<string, FamilyEvent>();

        for (const ev of events) {
          const startTime = new Date(ev.start).getTime();
          if (startTime < now.getTime()) continue;

          const memberId = ev.familyMember.id;
          const existing = nextEventsByMember.get(memberId);

          if (!existing || new Date(existing.start).getTime() > startTime) {
            nextEventsByMember.set(memberId, ev);
          }
        }

        const result: NextEvent[] = members
          .map((member) => ({
            member,
            event: nextEventsByMember.get(member.id)
          }))
          .sort((a, b) => a.member.name.localeCompare(b.member.name));

        setItems(result);
      } catch {
        setError("Failed to load next events");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading next events...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No family members found.</p>;
  }

  return (
      <div className="space-y-2">
        {items.map(({ member, event }) => (
          <div
            key={member.id}
            className="rounded-md bg-slate-50 px-3 py-2"
          >
            <div className="flex items-center gap-2 mb-1">
              {member.color && (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: member.color }}
                />
              )}
              <span className="font-semibold text-sm">{member.name}</span>
              <span className="text-xs text-slate-500">
                ({member.role.toLowerCase()})
              </span>
            </div>

            {event ? (
              <div className="text-sm">
                <span className="font-medium">{event.title}</span>{" "}
                <span className="text-slate-600">
                  — {humanizeDate(event.start)}
                  {event.location ? ` @ ${event.location}` : ""}
                </span>
              </div>
            ) : (
              <div className="text-sm text-slate-500">No upcoming events</div>
            )}
          </div>
        ))}
      </div>
    );
}