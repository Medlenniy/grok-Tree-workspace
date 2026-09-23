import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/layout/page-frame";

export const Route = createFileRoute("/pages/inbox")({ component: InboxPage });

const NOTES = [
  { title: "Подсветить src/routes на дереве", tag: "атлас" },
  { title: "Сверить глубину с реальной вложенностью", tag: "структура" },
  { title: "Проверить палитру «Иней» на листьях", tag: "палитра" },
  { title: "Повторить рост после смены угла", tag: "анимация" },
];

function InboxPage() {
  return (
    <PageFrame
      title="Входящие"
      path="src/routes/pages/inbox.tsx"
      blurb="Короткий список задач вокруг визуализации — как будто ревью структуры."
    >
      <ul className="divide-y divide-border rounded-lg bg-card shadow-[var(--shadow-border)]">
        {NOTES.map((n) => (
          <li key={n.title} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-fg">{n.title}</span>
            <span className="rounded-full bg-bg-subtle px-2 py-0.5 text-[11px] text-fg-muted">
              {n.tag}
            </span>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
