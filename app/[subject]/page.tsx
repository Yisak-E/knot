import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubject } from "@/lib/notes";

export const revalidate = 60;

type Params = Promise<{ subject: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const subject = await getSubject((await params).subject);
  return { title: subject?.title ?? "Subject", description: subject?.description ?? undefined };
}

export default async function SubjectPage({ params }: { params: Params }) {
  const subject = await getSubject((await params).subject);
  if (!subject) notFound();

  return (
    <div className="container" style={{ "--accent": subject.color } as React.CSSProperties}>
      <nav className="crumbs">
        <Link href="/">All subjects</Link>
      </nav>
      <header className="subject-head">
        {subject.code && <span className="subject-code">{subject.code}</span>}
        <h1>{subject.title}</h1>
        {subject.description && <p className="lede">{subject.description}</p>}
        <Link href={`/new?subject=${subject.slug}`} className="btn btn-ghost">
          + Add a note to {subject.title}
        </Link>
      </header>

      <ol className="note-list">
        {subject.notes.map((n, i) => (
          <li key={n.slug}>
            <Link href={`/${subject.slug}/${n.slug}`} className="note-card">
              <span className="note-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="note-card-body">
                <span className="note-card-title">{n.title}</span>
                {n.summary && <span className="note-card-summary">{n.summary}</span>}
                {n.tags.length > 0 && (
                  <span className="tags">
                    {n.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </span>
                )}
              </span>
              {n.source === "db" && <span className="badge">added online</span>}
            </Link>
          </li>
        ))}
      </ol>
      {subject.notes.length === 0 && <p className="muted">No notes in this subject yet.</p>}
    </div>
  );
}
