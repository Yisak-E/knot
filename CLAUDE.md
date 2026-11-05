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
   - **Chapter notes are structured bullet notes (the user's chosen format since Nov 5).** Each topic is a
     `## Topic Title` heading, then a bold **Definition:** line, short bold sub-headings (e.g. **How it works**,
     **Advantages**, **Disadvantages**, **Example: …**) with bullets or numbered steps under each, ✅/❌ for
     pros/cons, small comparison tables where several items share the same attributes, and a closing
     **In conclusion:** line. No LaTeX (write maths in plain text, e.g. 3 × 2 = 6).
     Short code blocks are fine where the code itself is the example.
   - End each chapter note with a `## Self-test` section of `<details><summary>Question</summary>` blocks, leaving a
     blank line after `<summary>…</summary>` and before `</details>` so the markdown inside renders.
   - When the user asks for reference links, add a "Further reading" line per topic pointing to text-based
     articles (GeeksforGeeks first, then Wikipedia or the RFC), as in the RFC 822 / SMTP / MIME / Radix-64
     section of `information-security/08-…`.
   - The cheat-sheet and practice-questions notes stay as compact lists and tables, since they are for quick revision.
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
