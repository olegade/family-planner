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
    return <p>Loading next events...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (items.length === 0) {
    return <p>No family members found.</p>;
  }

  return (
    <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
      <h2>Next event per family member</h2>
      <div>
        {items.map(({ member, event }) => (
          <div
            key={member.id}
            style={{
              padding: "0.75rem 1rem",
              marginBottom: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "8px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
              {member.color && (
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: member.color,
                    marginRight: "0.5rem"
                  }}
                />
              )}
              <strong>{member.name}</strong>
              <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", opacity: 0.7 }}>
                ({member.role.toLowerCase()})
              </span>
            </div>

            {event ? (
              <div style={{ fontSize: "0.9rem" }}>
                <span style={{ fontWeight: 500 }}>{event.title}</span>{" "}
                <span style={{ opacity: 0.8 }}>
                  —{" "}
                 {humanizeDate(event.start)}
                  {event.location ? ` @ ${event.location}` : ""}
                </span>
              </div>
            ) : (
              <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                No upcoming events
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}