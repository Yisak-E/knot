"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLibrary } from "@/lib/notes";
import { slugify } from "@/lib/markdown";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export interface FormState {
  error: string | null;
}

const RESERVED = new Set(["new", "login", "logout", "api", "_next", "edit"]);

function field(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function toSlug(input: string): string {
  return slugify(input).replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "").slice(0, 80);
}

function safeNext(next: string): string {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function signIn(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!supabaseConfigured()) return { error: "Supabase is not configured for this deployment." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: field(fd, "email"),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { error: error.message };
  redirect(safeNext(field(fd, "next") || "/new"));
}

export async function signOut() {
  if (supabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}

/** Returns the Supabase id of a subject, creating the row if the subject only exists locally or is new. */
async function ensureSubject(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fd: FormData
): Promise<{ id: string; slug: string } | { error: string }> {
  const choice = field(fd, "subject");

  if (choice && choice !== "__new") {
    const { data } = await supabase.from("knot_subjects").select("id, slug").eq("slug", choice).maybeSingle();
    if (data) return data;
    // A subject defined only in /content: mirror it in the database so notes can attach to it.
    const lib = await getLibrary();
    const local = lib.subjects.find((s) => s.slug === choice);
    if (!local) return { error: "That subject no longer exists." };
    const { data: created, error } = await supabase
      .from("knot_subjects")
      .insert({
        slug: local.slug,
        title: local.title,
        code: local.code,
        description: local.description,
        color: local.color,
        sort: local.sort,
      })
      .select("id, slug")
      .single();
    if (error) return { error: error.message };
    return created;
  }

  const title = field(fd, "newSubjectTitle");
  if (!title) return { error: "Give the new subject a name." };
  const slug = toSlug(field(fd, "newSubjectSlug") || title);
  if (!slug || RESERVED.has(slug)) return { error: "Choose a different subject URL name." };
  const lib = await getLibrary();
  if (lib.subjects.some((s) => s.slug === slug)) return { error: `A subject called “${slug}” already exists.` };

  const { data, error } = await supabase
    .from("knot_subjects")
    .insert({
      slug,
      title,
      code: field(fd, "newSubjectCode") || null,
      description: field(fd, "newSubjectDescription") || null,
      color: field(fd, "newSubjectColor") || "#0f766e",
    })
    .select("id, slug")
    .single();
  if (error) return { error: error.message };
  return data;
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => toSlug(t))
    .filter(Boolean)
    .slice(0, 12);
}

export async function createNote(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!supabaseConfigured()) return { error: "Supabase is not configured for this deployment." };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Sign in first." };

  const title = field(fd, "title");
  const body = String(fd.get("body") ?? "");
  if (!title) return { error: "The note needs a title." };
  if (!body.trim()) return { error: "The note is empty." };

  const subject = await ensureSubject(supabase, fd);
  if ("error" in subject) return { error: subject.error };

  const slug = toSlug(field(fd, "slug") || title);
  if (!slug || slug === "edit") return { error: "Choose a different note URL name." };
  const lib = await getLibrary();
  if (lib.notes.some((n) => n.subjectSlug === subject.slug && n.slug === slug)) {
    return { error: `This subject already has a note at “${slug}”. Pick another URL name.` };
  }

  const { error } = await supabase.from("knot_notes").insert({
    subject_id: subject.id,
    slug,
    title,
    summary: field(fd, "summary") || null,
    body_md: body,
    tags: parseTags(field(fd, "tags")),
    sort: Number(field(fd, "sort")) || 100,
  });
  if (error) {
    if (error.code === "42501") return { error: "Your account isn't allowed to add notes." };
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(`/${subject.slug}/${slug}`);
}

export async function updateNote(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!supabaseConfigured()) return { error: "Supabase is not configured for this deployment." };
  const supabase = await createClient();
  const id = field(fd, "id");
  const title = field(fd, "title");
  const body = String(fd.get("body") ?? "");
  if (!id) return { error: "Missing note id." };
  if (!title) return { error: "The note needs a title." };

  const { data, error } = await supabase
    .from("knot_notes")
    .update({
      title,
      summary: field(fd, "summary") || null,
      body_md: body,
      tags: parseTags(field(fd, "tags")),
      sort: Number(field(fd, "sort")) || 100,
    })
    .eq("id", id)
    .select("slug, knot_subjects(slug)")
    .maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: "You don't have permission to edit this note." };

  const subjectSlug = (data as unknown as { knot_subjects: { slug: string } | null }).knot_subjects?.slug ?? "";
  revalidatePath("/", "layout");
  redirect(`/${subjectSlug}/${data.slug}`);
}

export async function deleteNote(fd: FormData) {
  if (!supabaseConfigured()) return;
  const supabase = await createClient();
  const id = field(fd, "id");
  const subjectSlug = field(fd, "subjectSlug");
  await supabase.from("knot_notes").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect(`/${subjectSlug}`);
}
