import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/layout/page-frame";

export const Route = createFileRoute("/pages/settings")({ component: SettingsPage });

const ROWS = [
  { k: "Тема интерфейса", v: "Лесная ночь" },
  { k: "Палитра по умолчанию", v: "Мох" },
  { k: "Анимация роста", v: "Включена" },
  { k: "Уменьшенное движение", v: "Системное" },
];

function SettingsPage() {
  return (
    <PageFrame
      title="Настройки"
      path="src/routes/pages/settings.tsx"
      blurb="Предпочтения атласа хранятся локально: угол, глубина, длина и выбранная палитра."
    >
      <ul className="divide-y divide-border rounded-lg bg-card shadow-[var(--shadow-border)]">
        {ROWS.map((row) => (
          <li key={row.k} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm text-fg-muted">{row.k}</span>
            <span className="text-sm text-fg">{row.v}</span>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
