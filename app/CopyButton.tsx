"use client";

type CopyButtonProps = {
  text: string;
};

export default function CopyButton({ text }: CopyButtonProps) {
  function copyText() {
    navigator.clipboard.writeText(text);
  }

  return (
    <button
      type="button"
      onClick={copyText}
      aria-label="Copy connectivity SMILES"
    >
      Copy
    </button>
  );
}