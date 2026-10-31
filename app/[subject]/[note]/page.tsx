import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteTools } from "@/components/NoteTools";
import { renderMarkdown } from "@/lib/markdown";
import { getCurrentUser, getNote, getSubject } from "@/lib/notes";
import { deleteNote } from "@/app/actions";

export const revalidate = 60;

type Params = Promise<{ subject: string; note: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const note = await getNote(p.subject, p.note);
  return { title: note?.title ?? "Note", description: note?.summary ?? undefined };
}

export default async function NotePage({ params }: { params: Params }) {
  const p = await params;
  const [subject, note, user] = await Promise.all([getSubject(p.subject), getNote(p.subject, p.note), getCurrentUser()]);
  if (!subject || !note) notFound();

  const { html, toc } = renderMarkdown(note.body);
  const i = subject.notes.findIndex((n) => n.slug === note.slug);
  const prev = i > 0 ? subject.notes[i - 1] : null;
  const next = i < subject.notes.length - 1 ? subject.notes[i + 1] : null;
  const noteKey = `${subject.slug}/${note.slug}`;

  return (
    <div className="note-layout" style={{ "--accent": subject.color } as React.CSSProperties}>
      <aside className="note-side">
        <Link href={`/${subject.slug}`} className="side-subject">
          {subject.code && <span className="subject-code">{subject.code}</span>}
          {subject.title}
        </Link>
        <ol className="side-notes">
          {subject.notes.map((n) => (
            <li key={n.slug}>
              <Link href={`/${subject.slug}/${n.slug}`} className={n.slug === note.slug ? "is-current" : undefined}>
                {n.title}
              </Link>
            </li>
          ))}
        </ol>
        {toc.length > 0 && (
          <details className="toc" open>
            <summary>On this page</summary>
            <ul>
              {toc.map((t) => (
                <li key={t.id} className={t.depth === 3 ? "toc-sub" : undefined}>
                  <a href={`#${t.id}`}>{t.text}</a>
                </li>
              ))}
            </ul>
          </details>
        )}
      </aside>

      <article className="note">
        <nav className="crumbs">
          <Link href="/">All subjects</Link> <span aria-hidden="true">/</span>{" "}
          <Link href={`/${subject.slug}`}>{subject.title}</Link>
        </nav>
        <header className="note-head">
          <h1>{note.title}</h1>
          {note.summary && <p className="lede">{note.summary}</p>}
          <div className="note-head-row">
            <NoteTools noteKey={noteKey} />
            {note.source === "db" && user && note.id && (
              <div className="owner-tools">
                <Link href={`/${subject.slug}/${note.slug}/edit`} className="btn btn-ghost btn-sm">
                  Edit
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="id" value={note.id} />
                  <input type="hidden" name="subjectSlug" value={subject.slug} />
                  <button className="btn btn-danger btn-sm" type="submit">
                    Delete
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>

        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        <nav className="pager">
          {prev ? (
            <Link href={`/${subject.slug}/${prev.slug}`} className="pager-link">
              <span className="muted small">← Previous</span>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/${subject.slug}/${next.slug}`} className="pager-link pager-next">
              <span className="muted small">Next →</span>
              {next.title}
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
