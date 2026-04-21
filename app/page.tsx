"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, BookOpenText, FileText, Search } from "lucide-react";
import { SUGGESTED_TICKERS } from "@/lib/mock/tickers";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (symbol: string) => {
    const clean = symbol.trim().toUpperCase();
    if (!clean) return;
    router.push(`/n/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="flex flex-col flex-1 min-h-svh">
      <header className="flex items-center justify-between px-8 py-5 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
            <BookOpenText className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight">BursaNotes</span>
          <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
            Financial research, cited.
          </span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-full max-w-2xl flex flex-col items-center gap-10">
          <div className="text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Research a ticker,
              <br />
              <span className="text-primary">cited end-to-end.</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Ingest SEC filings, earnings, and news. Ask questions. Every
              answer links back to the source passage.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
            className="w-full"
          >
            <div className="group flex items-center gap-3 bg-surface border border-border rounded-2xl shadow-sm px-5 py-4 focus-within:border-primary/60 focus-within:shadow-md transition">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value.toUpperCase())}
                placeholder="Enter a Ticker to Start Research"
                className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground tracking-wide"
                spellCheck={false}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!value.trim()}
                className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
                aria-label="Open notebook"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Try a demo ticker
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_TICKERS.map((t) => (
                <button
                  key={t}
                  onClick={() => submit(t)}
                  className="px-3 py-1.5 rounded-full text-sm bg-surface border border-border hover:border-primary/60 hover:text-primary transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6">
            {[
              {
                icon: FileText,
                title: "Source-grounded",
                body: "Answers cite the exact filing and passage.",
              },
              {
                icon: BookOpenText,
                title: "Notebook per ticker",
                body: "Chat, sources, and artifacts stay together.",
              },
              {
                icon: Search,
                title: "Stop the Excel whiteboard",
                body: "Tables, memos, charts — reusable, not scattered.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border/60 bg-surface p-4"
              >
                <f.icon className="h-4 w-4 text-primary mb-2" />
                <div className="text-sm font-medium">{f.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
