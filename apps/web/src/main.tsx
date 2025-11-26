import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Dashboard } from "./Dashboard.js";
import { FamilyPanel } from "./FamilyPanel.js";
import { EventsPanel } from "./EventsPanel.js";
import "./styles.css";
import { Button } from "./components/ui/button.js";

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
          <nav className="flex gap-2 px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">

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

       <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {renderView()}
      </div>
    </main>
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
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      className="text-sm"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);