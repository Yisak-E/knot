import { cache } from "react";
import { readLocalCollection } from "./local-content";
import { createClient, supabaseConfigured } from "./supabase/server";
import type { Note, NoteMeta, SearchEntry, Subject, SubjectWithNotes } from "./types";

interface DbSubject {
  id: string;
  slug: string;
  title: string;
  code: string | null;
  description: string | null;
  color: string;
  sort: number;
}

interface DbNote {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body_md: string;
  tags: string[];
  sort: number;
  updated_at: string;
  knot_subjects: { slug: string } | null;
}

interface Library {
  subjects: SubjectWithNotes[];
  notes: Note[];
  dbError: string | null;
}

/**
 * Merges the two collections:
 *  - local: markdown files in /content (curated, versioned in git)
 *  - db:    subjects and notes added from the website (Supabase)
 * A database subject with the same slug as a local one is merged into it.
 */
export const getLibrary = cache(async (): Promise<Library> => {
  const local = await readLocalCollection();
  const subjects = new Map<string, Subject>(local.subjects.map((s) => [s.slug, s]));
  const notes: Note[] = [...local.notes];
  let dbError: string | null = null;

  if (supabaseConfigured()) {
    try {
      const supabase = await createClient();
      const [subRes, noteRes] = await Promise.all([
        supabase.from("knot_subjects").select("id, slug, title, code, description, color, sort"),
        supabase
          .from("knot_notes")
          .select("id, slug, title, summary, body_md, tags, sort, updated_at, knot_subjects(slug)"),
      ]);
      if (subRes.error) throw subRes.error;
      if (noteRes.error) throw noteRes.error;

      for (const s of (subRes.data ?? []) as DbSubject[]) {
        if (!subjects.has(s.slug)) {
          subjects.set(s.slug, {
            slug: s.slug,
            title: s.title,
            code: s.code,
            description: s.description,
            color: s.color,
            sort: s.sort,
            source: "db",
          });
        }
      }
      for (const n of (noteRes.data ?? []) as unknown as DbNote[]) {
        const subjectSlug = n.knot_subjects?.slug;
        if (!subjectSlug) continue;
        notes.push({
          id: n.id,
          slug: n.slug,
          subjectSlug,
          title: n.title,
          summary: n.summary,
          tags: n.tags ?? [],
          sort: n.sort,
          source: "db",
          updatedAt: n.updated_at,
          body: n.body_md,
        });
      }
    } catch (e) {
      dbError = e instanceof Error ? e.message : String(e);
    }
  }

  const bySort = <T extends { sort: number; title: string }>(a: T, b: T) =>
    a.sort - b.sort || a.title.localeCompare(b.title);

  notes.sort(bySort);
  const withNotes: SubjectWithNotes[] = [...subjects.values()].sort(bySort).map((s) => ({
    ...s,
    notes: notes
      .filter((n) => n.subjectSlug === s.slug)
      .map(({ body: _body, ...meta }): NoteMeta => meta),
  }));

  return { subjects: withNotes, notes, dbError };
});

export async function getSubject(slug: string) {
  const lib = await getLibrary();
  return lib.subjects.find((s) => s.slug === slug) ?? null;
}

export async function getNote(subjectSlug: string, noteSlug: string) {
  const lib = await getLibrary();
  return lib.notes.find((n) => n.subjectSlug === subjectSlug && n.slug === noteSlug) ?? null;
}

/** Plain-text search index for the client. */
export async function getSearchIndex(): Promise<SearchEntry[]> {
  const lib = await getLibrary();
  const titles = new Map(lib.subjects.map((s) => [s.slug, s.title]));
  return lib.notes.map((n) => ({
    href: `/${n.subjectSlug}/${n.slug}`,
    title: n.title,
    subject: titles.get(n.subjectSlug) ?? n.subjectSlug,
    summary: n.summary ?? "",
    text: n.body
      .replace(/<[^>]+>/g, " ")
      .replace(/[#*_`>|]/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 20000),
  }));
}

export async function getCurrentUser() {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}
