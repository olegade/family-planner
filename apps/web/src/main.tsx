import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { FamilyList } from "./FamilyList.js";
import { FamilyForm } from "./FamilyForm.js";
import { deleteFamilyMember, getFamilyMembers, type FamilyMember } from "./api/family.js";
import { EventList } from "./EventList.js";
import { EventForm } from "./EventForm.js";

const App = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFamilyMembers()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(member: FamilyMember) {
    setMembers((prev) => [...prev, member]);
  }

  async function handleDelete(id: string) {
  // Optional: optimistic update
  setMembers((prev) => prev.filter((m) => m.id !== id));

  try {
    await deleteFamilyMember(id);
  } catch {
    // If delete fails, you could refetch or show an error
    // For now, we keep it simple
  }
}

  return (
    <div style={{ padding: "1rem", fontFamily: "system-ui" }}>
      <h1>Family Planner</h1>
      <FamilyForm onCreated={handleCreated} />
      <FamilyList members={members} loading={loading} onDelete={handleDelete} />
      <EventForm onCreated={() => window.location.reload()} />

      <EventList />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);