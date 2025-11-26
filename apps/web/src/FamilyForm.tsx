import React, { useState } from "react";
import { Button } from "./components/ui/button.js";
import {
  createFamilyMember,
  type CreateFamilyMemberInput,
  type FamilyMember
} from "./api/family.js";

type Props = {
  onCreated(member: FamilyMember): void;
};

export function FamilyForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"PARENT" | "CHILD">("CHILD");
  const [color, setColor] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const payload: CreateFamilyMemberInput = {
      name: name.trim(),
      role,
      color: color.trim() || undefined
    };

    try {
      setSubmitting(true);
      const member = await createFamilyMember(payload);
      onCreated(member);
      setName("");
      setColor("");
      setRole("CHILD");
    } catch (err) {
      setError("Failed to create family member");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
          placeholder="Enter name"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "PARENT" | "CHILD")}
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
        >
          <option value="PARENT">Parent</option>
          <option value="CHILD">Child</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Color (optional)
        </label>
        <input
          type="text"
          placeholder="#ff0000"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
        />
      </div>

      <Button type="submit" disabled={submitting} className="text-sm">
        {submitting ? "Saving..." : "Add member"}
      </Button>
    </form>
  );
}