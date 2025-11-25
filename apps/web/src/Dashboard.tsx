import { NextEventSummary } from "./NextEventSummary.js";
import { FamilyPanel } from "./FamilyPanel.js";
import { EventsPanel } from "./EventsPanel.js";

export function Dashboard() {
  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: "960px",
        margin: "0 auto",
        fontFamily: "system-ui",
      }}
    >
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ marginBottom: "0.25rem" }}>Family Dashboard</h1>
        <p style={{ margin: 0, opacity: 0.8, fontSize: "0.95rem" }}>
          Overview of upcoming events and family activity.
        </p>
      </header>

      <section style={{ marginBottom: "2rem" }}>
        <NextEventSummary />
      </section>

      <section
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <FamilyPanel />
        <EventsPanel />
      </section>
    </div>
  );
}