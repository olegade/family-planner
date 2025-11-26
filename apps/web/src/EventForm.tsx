import { useState, useEffect } from "react";
import { createEvent } from "./api/events.js";
import { fetchFamilyMembers, FamilyMember } from "./api/family.js";
import { Button } from "./components/ui/button.js";

export function EventForm({ onCreated }: { onCreated: () => void }) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [familyMemberId, setFamilyMemberId] = useState("");

  useEffect(() => {
      async function load() {
        try {
          const data = await fetchFamilyMembers();
          setMembers(data);
          if (data.length > 0) setFamilyMemberId(data[0].id);

        } catch {
          setError("Failed to load events");
        } finally {
          setLoading(false);
        }
      }  
      load();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Start
        </label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          End
        </label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Location (optional)
        </label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
          placeholder="e.g. Gym, School, Home"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Family Member
        </label>
        <select
          value={familyMemberId}
          onChange={(e) => setFamilyMemberId(e.target.value)}
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="text-sm" disabled={!title || !start || !end}>
        Create Event
      </Button>
    </form>
  );
}

function setError(arg0: string) {
    throw new Error("Function not implemented.");
}
function setLoading(arg0: boolean) {
    throw new Error("Function not implemented.");
}
