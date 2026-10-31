import { promises as fs } from "fs";
import path from "path";
import { list, num, parseFrontmatter, str } from "./frontmatter";
import type { Note, Subject } from "./types";

/**
 * The curated collection lives in /content:
 *
 *   content/<subject-slug>/_subject.md   subject title, code, description, colour
 *   content/<subject-slug>/<nn-note>.md  one note per file (front matter + markdown)
 */
const CONTENT_DIR = path.join(process.cwd(), "content");

/** "01-putting-testing-first.md" becomes "putting-testing-first". */
export function fileToSlug(file: string): string {
  return file.replace(/\.md$/, "").replace(/^\d+[-_]/, "");
}

async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function readLocalCollection(): Promise<{ subjects: Subject[]; notes: Note[] }> {
  if (!(await exists(CONTENT_DIR))) return { subjects: [], notes: [] };

  const subjects: Subject[] = [];
  const notes: Note[] = [];
  const dirs = await fs.readdir(CONTENT_DIR, { withFileTypes: true });

  for (const dir of dirs) {
    if (!dir.isDirectory() || dir.name.startsWith(".") || dir.name.startsWith("_")) continue;
    const subjectSlug = dir.name;
    const subjectDir = path.join(CONTENT_DIR, subjectSlug);

    let meta: Record<string, ReturnType<typeof parseFrontmatter>["data"][string]> = {};
    const metaFile = path.join(subjectDir, "_subject.md");
    if (await exists(metaFile)) {
      meta = parseFrontmatter(await fs.readFile(metaFile, "utf8")).data;
    }

    subjects.push({
      slug: subjectSlug,
      title: str(meta.title) ?? subjectSlug.replace(/-/g, " "),
      code: str(meta.code),
      description: str(meta.description),
      color: str(meta.color) ?? "#0f766e",
      sort: num(meta.sort, 100),
      source: "local",
    });

    const files = (await fs.readdir(subjectDir)).filter(
      (f) => f.endsWith(".md") && !f.startsWith("_")
    );
    for (const file of files) {
      const { data, body } = parseFrontmatter(await fs.readFile(path.join(subjectDir, file), "utf8"));
      const slug = fileToSlug(file);
      notes.push({
        slug,
        subjectSlug,
        title: str(data.title) ?? slug.replace(/-/g, " "),
        summary: str(data.summary),
        tags: list(data.tags),
        sort: num(data.sort, 100),
        source: "local",
        body,
      });
    }
  }
  return { subjects, notes };
}
