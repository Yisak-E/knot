# Knot: working notes for Claude

Knot is a Next.js 15 (App Router, TypeScript) study-notes site. Notes come from two collections:

1. **Curated (git)**: `content/<subject-slug>/_subject.md` plus one `NN-note-slug.md` per note.
2. **Online (Supabase)**: tables `knot_subjects`, `knot_notes`, `knot_editors` in the Supabase project
   `literature-ielts` (ref `nscsuzbqhgyfaquufdsk`). The `knot_` tables are shared with that project; never touch its other tables.

## Adding exam notes for a new subject (the usual request)

When the user shares lecture slides or handouts and asks for notes:

1. Extract the material (slides, activities, answer keys).
2. Create `content/<subject-slug>/_subject.md` (title, code, description, color, sort) if the subject is new.
3. Write notes as numbered files, following the style of `content/software-testing/`:
   - Front matter: `title`, `summary`, `tags: [..]`, `sort`.
   - Start with "The big idea in one line", use `##` sections, tables for comparisons, `> **Exam tip:**` callouts,
     and ⭐ on must-know items.
   - End each note with a `## Self-test` section of `<details><summary>Question</summary>` blocks, leaving a
     blank line after `<summary>…</summary>` and before `</details>` so the markdown inside renders.
   - Add a cheat-sheet note and a practice-questions note (activities with hidden answers) when there is enough material.
4. Check facts and arithmetic against the source; label anything not in the source (e.g. "sample solution").
5. Commit as the user. Every commit must be authored by Yisak-E:
   `git -c user.name="Yisak Metaferiya" -c user.email="yisakmetaferiya1@gmail.com" commit ...`
   Add no co-author trailers. Push to `main`, and Vercel deploys automatically.

## Code map

- `lib/local-content.ts`: reads `/content`. `lib/frontmatter.ts` is a tiny front-matter parser (no deps).
- `lib/notes.ts`: merges local and Supabase collections (`getLibrary`, `getNote`, `getSearchIndex`).
- `lib/markdown.ts`: `marked` renderer with heading ids, TOC and scrollable tables.
- `app/actions.ts`: server actions (sign in/out, create/update/delete note). RLS enforces editor-only writes.
- `components/`: `SearchBox`, `NoteTools`, `NoteForm`, `LoginForm` (client components).
