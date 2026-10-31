import type { Metadata } from "next";
import Link from "next/link";
import { NoteForm } from "@/components/NoteForm";
import { getLibrary } from "@/lib/notes";

export const metadata: Metadata = { title: "Add a note" };

export default async function NewNotePage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  const { subjects } = await getLibrary();

  return (
    <div className="container narrow">
      <nav className="crumbs">
        <Link href="/">All subjects</Link>
      </nav>
      <h1>Add a note</h1>
      <p className="lede">
        Add to an existing subject or start a new one. Notes are saved to your Knot database and appear on the site
        straight away.
      </p>
      <NoteForm
        mode="create"
        subjects={subjects.map((s) => ({ slug: s.slug, title: s.title }))}
        defaultSubject={subjects.some((s) => s.slug === subject) ? subject : undefined}
      />
    </div>
  );
}
