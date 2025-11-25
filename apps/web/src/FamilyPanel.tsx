import { useEffect, useState } from "react";
import { FamilyForm } from "./FamilyForm.js";
import { FamilyList } from "./FamilyList.js";
import {
  deleteFamilyMember,
  fetchFamilyMembers,
  type FamilyMember,
} from "./api/family.js";

export function FamilyPanel() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFamilyMembers();
        setMembers(data);
      } catch {
        setError("Failed to load family members");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleCreated(member: FamilyMember) {
    setMembers((prev) => [...prev, member]);
  }

  async function handleDelete(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteFamilyMember(id);
    } catch {
      setError("Failed to delete family member");
    }
  }

  return (
    <div>
      <h2>Family</h2>

      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            background: "#fde2e1",
            color: "#7a1f1a",
            borderRadius: 6,
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <FamilyForm onCreated={handleCreated} />
      <FamilyList members={members} loading={loading} onDelete={handleDelete} />
    </div>
  );
}