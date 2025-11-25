import { useEffect, useState } from "react";
import { fetchEvents, FamilyEvent } from "./api/events.js";

export function EventList() {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading events...</p>;

  if (events.length === 0) return <p>No events yet.</p>;

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((ev) => (
          <li key={ev.id} style={{ marginBottom: "12px" }}>
            <strong>{ev.title}</strong><br />
            {new Date(ev.start).toLocaleString()} –{" "}
            {new Date(ev.end).toLocaleString()}<br />
            For: {ev.familyMember.name}
            {ev.location ? <> @ {ev.location}</> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}