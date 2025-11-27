import { useEffect, useState } from "react";
import { EventForm } from "./EventForm.js";
import { EventList } from "./EventList.js";
import { fetchEvents, type FamilyEvent } from "./api/events.js";

export function EventsPanel() {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchEvents({});
        setEvents(data);
      } catch {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleCreated(newEvent: FamilyEvent) {
    // Optimistically append the newly created event
    setEvents((prev) => [...prev, newEvent]);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Er du sikker på, at du vil slette denne aftale?")) {
      return;
    }

    try {
      await fetch(`http://localhost:3001/family-events/${id}`, {
        method: "DELETE",
      });

      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error("Failed to delete event", err);
      setError("Failed to delete event");
    }
  }

  return (
    <div className="space-y-4">
      <EventForm onCreated={handleCreated} />
      <EventList
        events={events}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />
    </div>
  );
}