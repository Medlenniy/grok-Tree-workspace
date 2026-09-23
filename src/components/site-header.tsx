import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/", label: "Обзор" },
  { to: "/atlas", label: "Атлас" },
  { to: "/structure", label: "Структура" },
  { to: "/pages", label: "Страницы" },
] as const;

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header
      className={cn(
        "z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-6",
        overlay ? "bg-bg" : "bg-bg",
      )}
    >
      <Link to="/" className="flex shrink-0 items-baseline gap-2 no-underline">
        <span className="font-display text-lg tracking-tight text-fg">Silva</span>
        <span className="hidden text-xs text-fg-subtle sm:inline">крона проекта</span>
      </Link>
      <nav className="flex min-w-0 items-center justify-end gap-0 overflow-hidden">
        {NAV.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-sm px-1.5 py-2 text-xs sm:px-2.5 sm:text-sm",
                "transition-colors duration-150",
                active ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
