import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteForm } from "@/components/NoteForm";
import { getNote } from "@/lib/notes";

export const metadata: Metadata = { title: "Edit note" };

type Params = Promise<{ subject: string; note: string }>;

export default async function EditNotePage({ params }: { params: Params }) {
  const p = await params;
  const note = await getNote(p.subject, p.note);
  if (!note) notFound();

  if (note.source !== "db" || !note.id) {
    return (
      <div className="container narrow">
        <h1>This note lives in the repository</h1>
        <p className="lede">
          Built-in notes are markdown files in <code>content/{note.subjectSlug}/</code>. Edit the file and push to
          GitHub, and Vercel redeploys the site automatically.
        </p>
        <Link href={`/${note.subjectSlug}/${note.slug}`} className="btn btn-ghost">
          ← Back to the note
        </Link>
      </div>
    );
  }

  return (
    <div className="container narrow">
      <nav className="crumbs">
        <Link href={`/${note.subjectSlug}/${note.slug}`}>← {note.title}</Link>
      </nav>
      <h1>Edit note</h1>
      <NoteForm
        mode="edit"
        subjects={[]}
        initial={{
          id: note.id,
          title: note.title,
          summary: note.summary ?? "",
          tags: note.tags.join(", "),
          sort: note.sort,
          body: note.body,
        }}
      />
    </div>
  );
}
