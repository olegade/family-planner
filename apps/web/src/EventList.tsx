import { useEffect, useState } from "react";
import { fetchEvents, type FamilyEvent } from "./api/events.js";
type Scope = "all" | "today" | "week";

type GroupedEvents = {
  memberId: string;
  memberName: string;
  memberRole: string;
  memberColor: string | null | undefined;
  events: FamilyEvent[];
};

export function EventList() {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope>("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const now = new Date();
        let from: string | undefined;
        let to: string | undefined;

        if (scope === "today") {
          const startOfDay = new Date(now);
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(now);
          endOfDay.setHours(23, 59, 59, 999);

          from = startOfDay.toISOString();
          to = endOfDay.toISOString();
        } else if (scope === "week") {
          const start = new Date(now);
          start.setHours(0, 0, 0, 0);

          const end = new Date(now);
          end.setDate(end.getDate() + 7);
          end.setHours(23, 59, 59, 999);

          from = start.toISOString();
          to = end.toISOString();
        }

        const data = await fetchEvents({ from, to });
        setEvents(data);
      } catch {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [scope]);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (events.length === 0) {
    return <p>No events yet.</p>;
  }

  // Group events by family member
  const groupsMap = new Map<string, GroupedEvents>();

  for (const ev of events) {
    const member = ev.familyMember;
    const key = member.id;

    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        memberId: member.id,
        memberName: member.name,
        memberRole: member.role,
        memberColor: member.color,
        events: []
      });
    }

    const group = groupsMap.get(key)!;
    group.events.push(ev);
  }

  // Convert map to array and sort
  const groups = Array.from(groupsMap.values())
    .sort((a, b) => a.memberName.localeCompare(b.memberName));

  // Sort events inside each group by start time
  groups.forEach((g) => {
    g.events.sort(
      (a, b) =>
        new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  });

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Upcoming Events by Family Member</h2>
      <div style={{ marginBottom: "0.75rem" }}>
        <span style={{ marginRight: "0.5rem" }}>Show:</span>
        <button
          type="button"
          onClick={() => setScope("all")}
          disabled={scope === "all"}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setScope("today")}
          disabled={scope === "today"}
          style={{ marginLeft: "0.5rem" }}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setScope("week")}
          disabled={scope === "week"}
          style={{ marginLeft: "0.5rem" }}
        >
          This week
        </button>
      </div>
      {groups.map((group) => (
        <div
          key={group.memberId}
          style={{
            marginBottom: "1.5rem",
            padding: "0.75rem 1rem",
            border: "1px solid #ddd",
            borderRadius: "8px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            {group.memberColor && (
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: group.memberColor,
                  marginRight: "0.5rem"
                }}
              />
            )}
            <strong>{group.memberName}</strong>
            <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", opacity: 0.7 }}>
              ({group.memberRole.toLowerCase()})
            </span>
          </div>

          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {group.events.map((ev) => (
              <li key={ev.id} style={{ marginBottom: "0.25rem" }}>
                <span style={{ fontWeight: 500 }}>{ev.title}</span>{" "}
                <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                  — {new Date(ev.start).toLocaleString()} →{" "}
                  {new Date(ev.end).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                  {ev.location ? ` @ ${ev.location}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}