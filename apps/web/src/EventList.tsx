import { useEffect, useState } from "react";
import { fetchEvents, type FamilyEvent } from "./api/events.js";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs.js";
import { Button } from "./components/ui/button.js";

type Scope = "all" | "today" | "week";

type GroupedEvents = {
  memberId: string;
  memberName: string;
  memberRole: string;
  memberColor: string | null | undefined;
  events: FamilyEvent[];
};

type EventListProps = {
  refreshKey?: number;
};

export function EventList({ refreshKey }: EventListProps) {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope>("all");

  async function handleDelete(id: string) {
    // Simple browser confirm dialog before deleting
    if (!window.confirm("Er du sikker på, at du vil slette denne aftale?")) {
      return;
    }

    try {
      await fetch(`http://localhost:3001/family-events/${id}`, {
        method: "DELETE",
      });

      // Optimistic update: remove the event locally
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  }

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
  }, [scope, refreshKey]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading events...</p>;
  }

  if (error) {
    return (
      <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (events.length === 0) {
    return <p className="text-sm text-slate-500">No events yet.</p>;
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
        events: [],
      });
    }

    const group = groupsMap.get(key)!;
    group.events.push(ev);
  }

  // Convert map to array and sort
  const groups = Array.from(groupsMap.values()).sort((a, b) =>
    a.memberName.localeCompare(b.memberName)
  );

  // Sort events inside each group by start time
  groups.forEach((g) => {
    g.events.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  });

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800">
          Upcoming events by family member
        </h2>

        <Tabs
          value={scope}
          onValueChange={(value: string) => setScope(value as Scope)}
          className="ml-auto"
        >
          <TabsList className="h-8">
            <TabsTrigger value="all" className="px-3 text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="today" className="px-3 text-xs">
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="px-3 text-xs">
              This week
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.memberId}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              {group.memberColor && (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: group.memberColor }}
                />
              )}
              <span className="text-sm font-semibold text-slate-900">
                {group.memberName}
              </span>
              <span className="text-xs text-slate-500">
                ({group.memberRole.toLowerCase()})
              </span>
            </div>

            <ul className="mt-1 space-y-1 text-sm text-slate-700">
              {group.events.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-start justify-between gap-2 rounded-md bg-slate-50 px-3 py-1.5"
                >
                  <div className="flex-1">
                    <span className="font-medium">{ev.title}</span>{" "}
                    <span className="text-slate-600">
                      — {new Date(ev.start).toLocaleString()} →{" "}
                      {new Date(ev.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {ev.location ? ` @ ${ev.location}` : ""}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(ev.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}