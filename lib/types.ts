/** Where a note or subject comes from. */
export type Source = "local" | "db";

export interface Subject {
  slug: string;
  title: string;
  code: string | null;
  description: string | null;
  color: string;
  sort: number;
  /** "local" when defined only in /content; "db" when it exists in Supabase. */
  source: Source;
}

export interface NoteMeta {
  slug: string;
  subjectSlug: string;
  title: string;
  summary: string | null;
  tags: string[];
  sort: number;
  source: Source;
  /** Supabase row id for notes stored in the database. */
  id?: string;
  updatedAt?: string;
}

export interface Note extends NoteMeta {
  body: string;
}

export interface SubjectWithNotes extends Subject {
  notes: NoteMeta[];
}

/** Lightweight record sent to the client for search. */
export interface SearchEntry {
  href: string;
  title: string;
  subject: string;
  summary: string;
  text: string;
}
