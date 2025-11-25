import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Dashboard } from "./Dashboard.js";
import { FamilyPanel } from "./FamilyPanel.js";
import { EventsPanel } from "./EventsPanel.js";

type View = "dashboard" | "family" | "events";

const App = () => {
  const [view, setView] = useState<View>("dashboard");

  function renderView() {
    switch (view) {
      case "family":
        return (
          <div style={{ padding: "1.5rem", maxWidth: "960px", margin: "0 auto" }}>
            <h1>Family</h1>
            <FamilyPanel />
          </div>
        );
      case "events":
        return (
          <div style={{ padding: "1.5rem", maxWidth: "960px", margin: "0 auto" }}>
            <h1>Events</h1>
            <EventsPanel />
          </div>
        );
      case "dashboard":
      default:
        return <Dashboard />;
    }
  }

  return (
    <>
      {/* Simple top navigation */}
      <nav
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          borderBottom: "1px solid #ddd",
          marginBottom: "1rem",
          fontFamily: "system-ui",
        }}
      >
        <NavButton
          label="Dashboard"
          active={view === "dashboard"}
          onClick={() => setView("dashboard")}
        />
        <NavButton
          label="Family"
          active={view === "family"}
          onClick={() => setView("family")}
        />
        <NavButton
          label="Events"
          active={view === "events"}
          onClick={() => setView("events")}
        />
      </nav>

      {renderView()}
    </>
  );
};

type NavButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function NavButton({ label, active, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0.35rem 0.75rem",
        borderRadius: 999,
        border: active ? "1px solid #2563eb" : "1px solid #ccc",
        background: active ? "#2563eb" : "#fff",
        color: active ? "#fff" : "#333",
        fontSize: "0.9rem",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);