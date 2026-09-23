import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ControlsPanel } from "@/components/tree/controls-panel";
import { FractalCanvas } from "@/components/tree/fractal-canvas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/atlas")({ component: AtlasPage });

function AtlasPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell flush overlayHeader>
      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-border bg-sidebar p-5 lg:block">
          <ControlsPanel />
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1 bg-bg">
          <FractalCanvas />
          <div className="pointer-events-none absolute inset-x-0 top-0 p-4 sm:p-5">
            <p className="font-display text-2xl tracking-tight text-fg/90 sm:text-3xl">Атлас</p>
            <p className="mt-1 max-w-sm text-sm text-fg-muted">
              Фрактальная карта silva — ветви это папки, листья это файлы.
            </p>
          </div>
        </div>

        <div className="z-10 max-h-[45dvh] shrink-0 overflow-y-auto border-t border-border bg-bg p-3 lg:hidden">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm text-fg-muted">Параметры кроны</p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              <SlidersHorizontal />
              {open ? "Скрыть" : "Настройки"}
            </Button>
          </div>
          <div className={cn(!open && "hidden")}>
            <ControlsPanel compact />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
