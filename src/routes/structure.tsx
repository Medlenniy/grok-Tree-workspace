import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, FileCode, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { collectStats, flattenTree } from "@/lib/project-tree";
import { useTreeStore } from "@/lib/tree-store";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/structure")({ component: StructurePage });

function StructurePage() {
  const root = useTreeStore((s) => s.root);
  const rows = useMemo(() => flattenTree(root), [root]);
  const stats = useMemo(() => collectStats(root), [root]);
  const [query, setQuery] = useState("");
  const setSelectedId = useTreeStore((s) => s.setSelectedId);
  const filtered = rows.filter((r) => r.path.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs tracking-[0.16em] text-fg-subtle uppercase">исходники</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">Структура проекта</h1>
        <p className="mt-3 max-w-xl text-fg-muted">
          {stats.dirs} папок и {stats.files} файлов. Выберите узел — атлас подсветит соответствующую
          ветвь.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти файл или папку"
            className="h-11 w-full rounded-md bg-bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-ring/70 sm:max-w-sm"
          />
          <Link
            to="/atlas"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            К дереву
          </Link>
        </div>

        <ul className="mt-6 divide-y divide-border rounded-lg bg-card shadow-[var(--shadow-border)]">
          {filtered.map(({ path, node, depth }) => (
            <li key={path}>
              <button
                type="button"
                onClick={() => setSelectedId(path)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-bg-subtle",
                )}
                style={{ paddingLeft: 12 + depth * 16 }}
              >
                {node.kind === "dir" ? (
                  <Folder className="size-4 shrink-0 text-fg-subtle" />
                ) : (
                  <FileCode className="size-4 shrink-0 text-fg-subtle" />
                )}
                <span className="truncate text-fg">{node.name}</span>
                <span className="ml-auto hidden truncate font-mono text-[11px] text-fg-subtle sm:inline">
                  {path}
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-fg-subtle" />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </AppShell>
  );
}
