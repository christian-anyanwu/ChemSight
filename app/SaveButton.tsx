"use client";

import { useRouter } from "next/navigation";

type SaveButtonProps = {
  cid: number;
  name: string;
  formula: string;
  smiles?: string;
};
type SaveResponse = {
  status: "saved" | "exists";
};

export default function SaveButton({
  cid,
  name,
  formula,
  smiles,
}: SaveButtonProps) {
  const router = useRouter();
  async function saveCompound() {
    const response = await fetch("http://127.0.0.1:8000/saved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cid: cid,
        name: name,
        formula: formula,
        smiles: smiles ?? null,
      }),
    });

    if (response.ok) {
  const data = (await response.json()) as SaveResponse;

  if (data.status === "exists") {
  alert("Compound already saved!");
  } else {
    alert("Compound saved!");
    router.refresh();
  }
} else {
  alert("Could not save compound.");
}
  }

  return (
    <button
      className="save-button"
      type="button"
      onClick={saveCompound}
      aria-label={`Save ${name}`}
    >
      <span aria-hidden="true">+</span> Save
    </button>
  );
}