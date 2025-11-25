import { EventForm } from "./EventForm.js";
import { EventList } from "./EventList.js";

export function EventsPanel() {
  return (
    <div>
      <h2>Events</h2>
      <EventForm onCreated={() => window.location.reload()} />
      <EventList />
    </div>
  );
}