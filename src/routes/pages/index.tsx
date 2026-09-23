import { createFileRoute, Link } from "@tanstack/react-router";
import { PROJECT_PAGES } from "@/lib/project-tree";

export const Route = createFileRoute("/pages/")({ component: PagesIndex });

function PagesIndex() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs tracking-[0.16em] text-fg-subtle uppercase">маршруты</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Страницы</h1>
      <p className="mt-3 max-w-xl text-fg-muted">
        В проекте несколько экранов. Каждый из них — лист на фрактальном дереве атласа.
      </p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {PROJECT_PAGES.map((page) => (
          <li key={page.to}>
            <Link
              to={page.to}
              className="flex h-full flex-col rounded-lg bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)] active:scale-[0.99]"
            >
              <span className="font-mono text-[11px] text-fg-subtle">{page.path}</span>
              <span className="mt-3 font-display text-2xl tracking-tight">{page.title}</span>
              <span className="mt-2 text-sm leading-relaxed text-fg-muted">{page.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
