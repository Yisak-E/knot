import Link from "next/link";
import { getLibrary } from "@/lib/notes";

export const revalidate = 60;

export default async function HomePage() {
  const { subjects, notes, dbError } = await getLibrary();

  return (
    <div className="container">
      <section className="hero">
        <p className="eyebrow">Study collection</p>
        <h1>Everything you need before the exam, in one place.</h1>
        <p className="lede">
          {subjects.length} {subjects.length === 1 ? "subject" : "subjects"} · {notes.length} notes. Open a subject,
          revise the key ideas, then test yourself with the hidden answers.
        </p>
      </section>

      {dbError && (
        <p className="notice">Notes added from the website couldn&apos;t be loaded right now. The built-in notes are shown.</p>
      )}

      <section className="subject-grid">
        {subjects.map((s) => (
          <article key={s.slug} className="subject-card" style={{ "--accent": s.color } as React.CSSProperties}>
            <Link href={`/${s.slug}`} className="subject-card-head">
              {s.code && <span className="subject-code">{s.code}</span>}
              <h2>{s.title}</h2>
              {s.description && <p>{s.description}</p>}
            </Link>
            <ol className="subject-card-notes">
              {s.notes.slice(0, 6).map((n) => (
                <li key={n.slug}>
                  <Link href={`/${s.slug}/${n.slug}`}>{n.title}</Link>
                </li>
              ))}
            </ol>
            {s.notes.length === 0 && <p className="muted small">No notes yet.</p>}
            {s.notes.length > 6 && (
              <Link className="small" href={`/${s.slug}`}>
                All {s.notes.length} notes →
              </Link>
            )}
          </article>
        ))}

        <Link href="/new" className="subject-card subject-card-add">
          <span className="add-plus" aria-hidden="true">+</span>
          <span>Add a note or start a new subject</span>
        </Link>
      </section>
    </div>
  );
}
