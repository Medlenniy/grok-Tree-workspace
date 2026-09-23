import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function PageFrame({
  title,
  path,
  blurb,
  children,
}: {
  title: string;
  path: string;
  blurb: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <p className="font-mono text-xs tracking-wide text-fg-subtle">{path}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl tracking-tight text-fg sm:text-4xl">{title}</h1>
          <p className="mt-3 text-fg-muted">{blurb}</p>
        </div>
        <Link
          to="/atlas"
          className="inline-flex h-11 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          Показать на дереве
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="mt-10">{children}</div>
    </main>
  );
}
