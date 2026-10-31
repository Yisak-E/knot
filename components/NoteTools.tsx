"use client";

import { useEffect, useState } from "react";

const STORE = "knot:reviewed";

function readReviewed(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
}

/** Reveal/hide all answers, print, and a per-browser "reviewed" tick. */
export function NoteTools({ noteKey }: { noteKey: string }) {
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    setReviewed(Boolean(readReviewed()[noteKey]));
  }, [noteKey]);

  function toggleAll() {
    const next = !revealed;
    document.querySelectorAll<HTMLDetailsElement>(".prose details").forEach((d) => {
      d.open = next;
    });
    setRevealed(next);
  }

  function toggleReviewed() {
    const next = !reviewed;
    setReviewed(next);
    try {
      const all = readReviewed();
      if (next) all[noteKey] = true;
      else delete all[noteKey];
      localStorage.setItem(STORE, JSON.stringify(all));
    } catch {
      // Storage unavailable (private mode): the tick just won't persist.
    }
  }

  return (
    <div className="note-tools">
      <button type="button" className="btn btn-ghost btn-sm" onClick={toggleAll}>
        {revealed ? "Hide all answers" : "Reveal all answers"}
      </button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
          document.querySelectorAll<HTMLDetailsElement>(".prose details").forEach((d) => (d.open = true));
          setRevealed(true);
          window.print();
        }}>
        Print
      </button>
      <button
        type="button"
        className={`btn btn-sm ${reviewed ? "btn-done" : "btn-ghost"}`}
        aria-pressed={reviewed}
        onClick={toggleReviewed}
      >
        {reviewed ? "✓ Reviewed" : "Mark reviewed"}
      </button>
    </div>
  );
}
