import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FractalCanvas } from "@/components/tree/fractal-canvas";
import { collectStats, PROJECT_PAGES } from "@/lib/project-tree";
import { useTreeStore } from "@/lib/tree-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const root = useTreeStore((s) => s.root);
  const stats = collectStats(root);
  return (
    <AppShell>
      <main className="flex flex-1 flex-col">
        <section className="grid flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-14">
            <p className="text-xs tracking-[0.18em] text-fg-subtle uppercase">React · TypeScript</p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Структура, которая растёт
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-fg-muted">
              Отдельная страница-атлас превращает дерево файлов в генеративное фрактальное дерево:
              угол ветвления, глубина, длина ветвей и палитра — а при загрузке крона оживает.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/atlas"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.96]"
              >
                Открыть атлас
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to="/structure"
                className="inline-flex h-12 items-center rounded-md px-5 text-sm text-fg shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] active:scale-[0.96]"
              >
                Список файлов
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              <Stat label="страницы" value={String(PROJECT_PAGES.length)} />
              <Stat label="файлы" value={String(stats.files)} />
              <Stat label="папки" value={String(stats.dirs)} />
            </dl>
          </div>
          <div className="relative min-h-80 overflow-hidden border-t border-border lg:min-h-0 lg:border-t-0 lg:border-l">
            <FractalCanvas preview />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent p-5">
              <p className="text-xs text-fg-muted">Предпросмотр кроны · полная карта в атласе</p>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-5 py-10 sm:px-10 lg:px-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl tracking-tight">Страницы проекта</h2>
            <Link to="/pages" className="text-sm text-fg-muted hover:text-fg">
              Все страницы
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PROJECT_PAGES.map((page) => (
              <li key={page.to}>
                <Link
                  to={page.to}
                  className="flex h-full flex-col rounded-lg bg-card p-4 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] active:scale-[0.99]"
                >
                  <span className="font-mono text-[11px] text-fg-subtle">{page.path}</span>
                  <span className="mt-3 font-medium text-fg">{page.title}</span>
                  <span className="mt-1 text-sm leading-relaxed text-fg-muted">{page.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-fg-subtle">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular-nums tracking-tight">{value}</dd>
    </div>
  );
}
