import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { SearchBox } from "@/components/SearchBox";
import { getCurrentUser, getSearchIndex } from "@/lib/notes";
import { signOut } from "./actions";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Knot — exam-ready notes", template: "%s · Knot" },
  description: "Exam-ready study notes, organised into subject collections.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#14161a" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [index, user] = await Promise.all([getSearchIndex(), getCurrentUser()]);

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand" aria-label="Knot home">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 7c3-3 7-1 7 3s-4 6-7 4-1-7 3-7 7 3 7 7" />
                </svg>
              </span>
              Knot
            </Link>
            <SearchBox index={index} />
            <nav className="topnav">
              <Link href="/new" className="btn btn-primary">
                + Add note
              </Link>
              {user ? (
                <form action={signOut}>
                  <button className="btn btn-ghost" type="submit" title={user.email ?? undefined}>
                    Sign out
                  </button>
                </form>
              ) : (
                <Link href="/login" className="btn btn-ghost">
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <p>Knot · study notes by Yisak-E</p>
        </footer>
      </body>
    </html>
  );
}
