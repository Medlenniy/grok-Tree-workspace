import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/layout/page-frame";

export const Route = createFileRoute("/pages/docs")({ component: DocsPage });

const STEPS = [
  {
    t: "Топология",
    d: "Каждая папка — развилка, каждый файл — терминаль с кроной листьев. Лишняя глубина достраивается фрактальными веточками.",
  },
  {
    t: "Параметры",
    d: "Угол задаёт раствор веера, глубина обрезает уровни, длина масштабирует ствол и все дочерние сегменты.",
  },
  {
    t: "Рост",
    d: "При загрузке и после «Заново» дерево прорастает от корня к листьям. Если система просит меньше движения — крона появляется сразу.",
  },
];

function DocsPage() {
  return (
    <PageFrame
      title="Документация"
      path="src/routes/pages/docs.tsx"
      blurb="Как читать фрактальную карту и зачем нужны три ползунка."
    >
      <ol className="space-y-3">
        {STEPS.map((s, i) => (
          <li key={s.t} className="rounded-lg bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 font-display text-2xl tracking-tight">{s.t}</p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </PageFrame>
  );
}
