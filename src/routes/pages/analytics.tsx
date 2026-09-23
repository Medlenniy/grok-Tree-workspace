import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/layout/page-frame";

export const Route = createFileRoute("/pages/analytics")({ component: AnalyticsPage });

const BARS = [
  { name: "routes", n: 14 },
  { name: "components", n: 11 },
  { name: "lib", n: 6 },
  { name: "hooks", n: 2 },
  { name: "public", n: 2 },
];

function AnalyticsPage() {
  const max = Math.max(...BARS.map((b) => b.n));
  return (
    <PageFrame
      title="Аналитика"
      path="src/routes/pages/analytics.tsx"
      blurb="Распределение файлов по папкам — та же топология, что растёт в атласе."
    >
      <div className="rounded-lg bg-card p-5 shadow-[var(--shadow-border)]">
        <ul className="space-y-4">
          {BARS.map((b) => (
            <li key={b.name}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-mono text-fg">{b.name}</span>
                <span className="tabular-nums text-fg-muted">{b.n}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-bg-subtle">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(b.n / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
