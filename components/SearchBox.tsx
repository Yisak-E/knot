"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/types";

function snippet(text: string, q: string): string {
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return "";
  const start = Math.max(0, i - 50);
  return (start > 0 ? "…" : "") + text.slice(start, i + q.length + 70).trim() + "…";
}

export function SearchBox({ index }: { index: SearchEntry[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    const terms = query.split(/\s+/);
    return index
      .map((e) => {
        const title = e.title.toLowerCase();
        const hay = `${title} ${e.summary.toLowerCase()} ${e.text.toLowerCase()}`;
        if (!terms.every((t) => hay.includes(t))) return null;
        const score = terms.reduce((s, t) => s + (title.includes(t) ? 10 : 0) + (hay.split(t).length - 1), 0);
        return { e, score, snip: snippet(e.text, terms[0]) };
      })
      .filter((r): r is { e: SearchEntry; score: number; snip: string } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [q, index]);

  return (
    <div className="search" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <input
        ref={inputRef}
        type="search"
        placeholder="Search notes…  ( / )"
        aria-label="Search notes"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && results[active]) {
            router.push(results[active].e.href);
            setOpen(false);
            setQ("");
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {open && q.trim().length >= 2 && (
        <div className="search-results" role="listbox">
          {results.length === 0 ? (
            <p className="search-empty">No notes match “{q}”.</p>
          ) : (
            results.map((r, i) => (
              <Link
                key={r.e.href}
                href={r.e.href}
                className={`search-hit${i === active ? " is-active" : ""}`}
                onClick={() => {
                  setOpen(false);
                  setQ("");
                }}
              >
                <span className="search-hit-subject">{r.e.subject}</span>
                <span className="search-hit-title">{r.e.title}</span>
                {r.snip && <span className="search-hit-snip">{r.snip}</span>}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
