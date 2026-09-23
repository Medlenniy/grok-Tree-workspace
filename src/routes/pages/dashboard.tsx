import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/layout/page-frame";

export const Route = createFileRoute("/pages/dashboard")({ component: DashboardPage });

const METRICS = [
  { label: "Маршруты", value: "11" },
  { label: "Компоненты", value: "14" },
  { label: "Глубина src", value: "4" },
  { label: "Точка входа", value: "index" },
];

const ACTIVITY = [
  { name: "atlas.tsx", note: "фрактальный холст" },
  { name: "tree-engine.ts", note: "L-система ветвей" },
  { name: "palettes.ts", note: "шесть палитр кроны" },
  { name: "pages/dashboard.tsx", note: "этот экран" },
];

function DashboardPage() {
  return (
    <PageFrame
      title="Дашборд"
      path="src/routes/pages/dashboard.tsx"
      blurb="Сводка по рабочему пространству Silva — сколько экранов, насколько глубока крона."
    >
      <div className="grid gap-3 sm:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-lg bg-card px-4 py-4 shadow-[var(--shadow-border)]">
            <p className="text-xs text-fg-subtle">{m.label}</p>
            <p className="mt-2 font-display text-2xl tabular-nums tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg bg-card shadow-[var(--shadow-border)]">
        <p className="border-b border-border px-4 py-3 text-sm text-fg-muted">Недавние узлы</p>
        <ul>
          {ACTIVITY.map((row) => (
            <li
              key={row.name}
              className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-0"
            >
              <span className="font-mono text-sm">{row.name}</span>
              <span className="text-sm text-fg-muted">{row.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
