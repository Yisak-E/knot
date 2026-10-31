import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container narrow">
      <h1>Not found</h1>
      <p className="lede">That subject or note doesn&apos;t exist (yet).</p>
      <Link href="/" className="btn btn-ghost">
        ← All subjects
      </Link>
    </div>
  );
}
