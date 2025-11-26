import { useState } from "react";
import { EventForm } from "./EventForm.js";
import { EventList } from "./EventList.js";

export function EventsPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCreated() {
    // Increment a simple counter so EventList can refetch when this changes
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-4">
      <EventForm onCreated={handleCreated} />
      <EventList refreshKey={refreshKey} />
    </div>
  );
}