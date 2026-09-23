import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/layout/page-frame";

export const Route = createFileRoute("/pages/profile")({ component: ProfilePage });

function ProfilePage() {
  return (
    <PageFrame
      title="Профиль"
      path="src/routes/pages/profile.tsx"
      blurb="Автор рабочего пространства. Здесь нет аккаунтов — атлас живёт в этой сессии."
    >
      <div className="rounded-lg bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="font-display text-2xl tracking-tight">Наблюдатель кроны</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
          Наведите курсор на ветвь в атласе, чтобы прочитать путь файла. Нажмите
          «Заново», чтобы вырастить другую форму того же проекта.
        </p>
      </div>
    </PageFrame>
  );
}
