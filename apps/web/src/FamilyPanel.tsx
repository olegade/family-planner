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
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <FamilyForm onCreated={handleCreated} />
      <FamilyList members={members} loading={loading} onDelete={handleDelete} />
    </div>
  );
}