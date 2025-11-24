import React, { useState } from "react";
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
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h2>Add family member</h2>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Role:{" "}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "PARENT" | "CHILD")}
          >
            <option value="PARENT">Parent</option>
            <option value="CHILD">Child</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Color (optional):{" "}
          <input
            type="text"
            placeholder="#ff0000"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Add member"}
      </button>
    </form>
  );
}