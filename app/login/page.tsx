import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="container narrow">
      <h1>Sign in</h1>
      <p className="lede">Anyone can read the notes. Sign in to add, edit or delete them.</p>
      <LoginForm next={next ?? "/new"} />
    </div>
  );
}
