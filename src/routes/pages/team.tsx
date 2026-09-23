import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/layout/page-frame";

export const Route = createFileRoute("/pages/team")({ component: TeamPage });

const PEOPLE = [
  { name: "Корневой", role: "архитектура маршрутов" },
  { name: "Крона", role: "генеративная геометрия" },
  { name: "Лист", role: "палитры и рост" },
];

function TeamPage() {
  return (
    <PageFrame
      title="Команда"
      path="src/routes/pages/team.tsx"
      blurb="Роли вокруг карты проекта — ещё несколько узлов в src/routes/pages."
    >
      <ul className="grid gap-3 sm:grid-cols-3">
        {PEOPLE.map((p) => (
          <li key={p.name} className="rounded-lg bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="font-display text-xl tracking-tight">{p.name}</p>
            <p className="mt-2 text-sm text-fg-muted">{p.role}</p>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
