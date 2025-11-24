import type { FamilyMember } from "./api/family.js";

type Props = {
  members: FamilyMember[];
  loading: boolean;
  onDelete(id: string): void;
};

export function FamilyList({ members, loading, onDelete }: Props) {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (members.length === 0) {
    return <p>No family members yet.</p>;
  }

  return (
    <div>
      <h2>Family Members</h2>
      <ul>
        {members.map((m) => (
          <li key={m.id} style={{ marginBottom: "0.25rem" }}>
            <strong>{m.name}</strong> — {m.role.toLowerCase()}{" "}
            <button
              type="button"
              onClick={() => onDelete(m.id)}
              style={{ marginLeft: "0.5rem" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}