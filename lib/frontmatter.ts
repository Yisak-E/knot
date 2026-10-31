/**
 * Minimal YAML front-matter parser for note files.
 * Supports `key: value`, quoted strings, numbers and inline lists `[a, b]`,
 * which is all the content collection needs, without extra dependencies.
 */
export type FrontValue = string | number | string[];

export interface Parsed {
  data: Record<string, FrontValue>;
  body: string;
}

function unquote(v: string): string {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

function parseValue(raw: string): FrontValue {
  const v = raw.trim();
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => unquote(s))
      .filter(Boolean);
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return unquote(v);
}

export function parseFrontmatter(source: string): Parsed {
  const text = source.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) return { data: {}, body: text };
  const end = text.indexOf("\n---", 4);
  if (end === -1) return { data: {}, body: text };

  const data: Record<string, FrontValue> = {};
  for (const line of text.slice(4, end).split("\n")) {
    const m = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (m) data[m[1]] = parseValue(m[2]);
  }
  const body = text.slice(end + 4).replace(/^\n+/, "");
  return { data, body };
}

export function str(v: FrontValue | undefined): string | null {
  if (v === undefined) return null;
  return Array.isArray(v) ? v.join(", ") : String(v);
}

export function num(v: FrontValue | undefined, fallback: number): number {
  return typeof v === "number" ? v : fallback;
}

export function list(v: FrontValue | undefined): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v) return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}
