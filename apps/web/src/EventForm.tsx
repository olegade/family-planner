import { useState, useEffect } from "react";
import { createEvent } from "./api/events.js";
import { getFamilyMembers, FamilyMember } from "./api/family.js";

export function EventForm({ onCreated }: { onCreated: () => void }) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [familyMemberId, setFamilyMemberId] = useState("");

  useEffect(() => {
    getFamilyMembers().then((m) => {
      setMembers(m);
      if (m.length > 0) setFamilyMemberId(m[0].id);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const startDate = new Date(start);
    const endDate = new Date(end);

    await createEvent({
        title,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        location,
        familyMemberId
    });

    setTitle("");
    setStart("");
    setEnd("");
    setLocation("");

    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <h3>Create Event</h3>

      <div>
        <label>Title: </label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label>Start: </label>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
      </div>

      <div>
        <label>End: </label>
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
      </div>

      <div>
        <label>Location (optional): </label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div>
        <label>Family Member: </label>
        <select value={familyMemberId} onChange={(e) => setFamilyMemberId(e.target.value)}>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" style={{ marginTop: "10px" }}>Create Event</button>
    </form>
  );
}