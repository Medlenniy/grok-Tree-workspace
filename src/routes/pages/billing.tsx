import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/layout/page-frame";

export const Route = createFileRoute("/pages/billing")({ component: BillingPage });

function BillingPage() {
  return (
    <PageFrame
      title="Биллинг"
      path="src/routes/pages/billing.tsx"
      blurb="Заглушка тарифа рабочего пространства — ещё один лист на дереве маршрутов."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {["Studio", "Grove"].map((plan, i) => (
          <div key={plan} className="rounded-lg bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="text-xs text-fg-subtle">{i === 0 ? "текущий" : "следующий"}</p>
            <p className="mt-2 font-display text-2xl tracking-tight">{plan}</p>
            <p className="mt-2 text-sm text-fg-muted">
              {i === 0
                ? "Локальный атлас, неограниченные перегенерации кроны."
                : "Общие палитры и сохранённые семена для команды."}
            </p>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}
