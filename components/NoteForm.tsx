"use client";

import { useActionState, useMemo, useState } from "react";
import { createNote, updateNote, type FormState } from "@/app/actions";
import { renderMarkdown } from "@/lib/markdown";

interface SubjectOption {
  slug: string;
  title: string;
}

interface Props {
  mode: "create" | "edit";
  subjects: SubjectOption[];
  defaultSubject?: string;
  initial?: {
    id: string;
    title: string;
    summary: string;
    tags: string;
    sort: number;
    body: string;
  };
}

const STARTER = `## Key ideas

-

## Definitions

| Term | Meaning |
|---|---|
|  |  |

## Self-test

<details><summary>Q1. Your question here?</summary>

Your answer here.

</details>
`;

const initialState: FormState = { error: null };

export function NoteForm({ mode, subjects, defaultSubject, initial }: Props) {
  const [state, action, pending] = useActionState(mode === "create" ? createNote : updateNote, initialState);
  const [subject, setSubject] = useState(defaultSubject ?? subjects[0]?.slug ?? "__new");
  const [body, setBody] = useState(initial?.body ?? STARTER);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const preview = useMemo(() => (tab === "preview" ? renderMarkdown(body).html : ""), [tab, body]);

  return (
    <form action={action} className="form">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      {mode === "create" && (
        <fieldset className="field-group">
          <legend>Subject</legend>
          <label className="field">
            <span>Add this note to</span>
            <select name="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
              <option value="__new">+ New subject…</option>
            </select>
          </label>

          {subject === "__new" && (
            <div className="grid-2">
              <label className="field">
                <span>Subject name *</span>
                <input name="newSubjectTitle" placeholder="e.g. Database Systems" required />
              </label>
              <label className="field">
                <span>Course code</span>
                <input name="newSubjectCode" placeholder="e.g. CSC 305" />
              </label>
              <label className="field span-2">
                <span>Short description</span>
                <input name="newSubjectDescription" placeholder="What this subject's notes cover" />
              </label>
              <label className="field">
                <span>URL name (optional)</span>
                <input name="newSubjectSlug" placeholder="database-systems" />
              </label>
              <label className="field">
                <span>Accent colour</span>
                <input name="newSubjectColor" type="color" defaultValue="#7c3aed" />
              </label>
            </div>
          )}
        </fieldset>
      )}

      <fieldset className="field-group">
        <legend>Note</legend>
        <div className="grid-2">
          <label className="field span-2">
            <span>Title *</span>
            <input name="title" defaultValue={initial?.title} placeholder="e.g. Ch 7 — Graph Coverage" required />
          </label>
          <label className="field span-2">
            <span>One-line summary</span>
            <input name="summary" defaultValue={initial?.summary} placeholder="What this note covers" />
          </label>
          <label className="field">
            <span>Tags (comma separated)</span>
            <input name="tags" defaultValue={initial?.tags} placeholder="chapter-7, graphs" />
          </label>
          <label className="field">
            <span>Order in subject</span>
            <input name="sort" type="number" defaultValue={initial?.sort ?? 100} />
          </label>
          {mode === "create" && (
            <label className="field">
              <span>URL name (optional)</span>
              <input name="slug" placeholder="graph-coverage" />
            </label>
          )}
        </div>
      </fieldset>

      <div className="editor">
        <div className="editor-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")}>
            Write
          </button>
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>
            Preview
          </button>
          <span className="editor-hint">
            Markdown · tables · <code>&lt;details&gt;</code> for hidden answers
          </span>
        </div>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={22}
          spellCheck
          hidden={tab !== "write"}
        />
        {tab === "preview" && <div className="prose editor-preview" dangerouslySetInnerHTML={{ __html: preview }} />}
      </div>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Publish note" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
