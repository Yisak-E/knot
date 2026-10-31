# Knot

Exam-ready study notes, organised into **subject collections**.
Built with **Next.js 15 (App Router, TypeScript)**, **Supabase** and deployed on **Vercel**.

The first collection is **Software Testing (SWE 473)**: Chapter 4 (Putting Testing First), Chapter 6 Parts 1 and 2 (Input Space Partition Testing), a one-page cheat sheet, and every class activity with answers.

## Features

- Subjects → notes, with a table of contents, previous/next navigation and print view
- Self-test questions with hidden answers (`<details>`), plus "Reveal all answers"
- "Mark reviewed" ticks (saved in your browser)
- Instant search across every note (press `/`)
- **Add notes from the website**: sign in, pick a subject or create a new one, write markdown with live preview
- Light and dark mode, phone friendly

## Two kinds of notes

| | Where it lives | How to add |
|---|---|---|
| **Curated collection** | `content/<subject>/*.md` in this repo | Add a markdown file (or ask Claude to), commit, push. Vercel redeploys |
| **Online notes** | Supabase tables `knot_subjects`, `knot_notes` | "+ Add note" on the site (sign-in required) |

A database subject with the same slug as a folder in `content/` is merged into it, so you can add online notes to *Software Testing* too.

### Adding a subject to the curated collection

```
content/
  database-systems/
    _subject.md          # title, code, description, color, sort
    01-er-modelling.md   # one note per file
    02-normalisation.md
```

`_subject.md`:

```md
---
title: Database Systems
code: CSC 305
description: Exam notes for ER modelling, SQL and normalisation.
color: "#7c3aed"
sort: 2
---
```

Each note:

```md
---
title: "Ch 3 — Normalisation"
summary: 1NF to BCNF with worked examples.
tags: [chapter-3, normalisation]
sort: 1
---

## Key ideas
...

<details><summary>Q1. What is a transitive dependency?</summary>

Answer here.

</details>
```

The number prefix (`01-`) only orders files; the URL is `/database-systems/er-modelling`.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the Supabase URL and anon key
npm run dev
```

Without Supabase variables the site still runs and shows the curated collection.

## Database

Schema: `supabase/migrations/20261031_knot_notes_collections.sql`.
Everyone can read; only users listed in `knot_editors` can insert, update or delete (Row Level Security).

To let another account edit:

```sql
insert into public.knot_editors (user_id)
select id from auth.users where email = 'someone@example.com';
```

## Deploy

The repo is connected to Vercel, so every push to `main` deploys. Environment variables in Vercel:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
