import { Marked, type Tokens } from "marked";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/&[a-z]+;/g, "")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section"
  );
}

function plain(text: string): string {
  return text.replace(/[*_`]/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1").trim();
}

/** Renders note markdown to HTML and collects h2/h3 headings for the table of contents. */
export function renderMarkdown(md: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();

  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      heading(token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        const text = plain(token.text);
        let id = slugify(text);
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n > 0) id = `${id}-${n}`;
        if (token.depth === 2 || token.depth === 3) toc.push({ id, text, depth: token.depth });
        return `<h${token.depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${inner}</h${token.depth}>\n`;
      },
      table(token: Tokens.Table) {
        // Wrap tables so wide ones scroll on phones instead of breaking the layout.
        const head = token.header
          .map((c, i) => `<th${align(token.align[i])}>${inlineCell(c.text)}</th>`)
          .join("");
        const rows = token.rows
          .map((r) => `<tr>${r.map((c, i) => `<td${align(token.align[i])}>${inlineCell(c.text)}</td>`).join("")}</tr>`)
          .join("");
        return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });

  function inlineCell(text: string): string {
    return marked.parseInline(text, { async: false }) as string;
  }

  const html = marked.parse(md, { async: false }) as string;
  return { html, toc };
}

function align(a: "center" | "left" | "right" | null | undefined): string {
  return a ? ` style="text-align:${a}"` : "";
}
