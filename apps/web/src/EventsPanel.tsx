import { EventForm } from "./EventForm.js";
import { EventList } from "./EventList.js";

export function EventsPanel() {
  return (
    <div className="space-y-4">
      <EventForm onCreated={() => window.location.reload()} />
      <EventList />
    </div>
  );
}