import type { ChangeEvent, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PALETTES } from "@/lib/palettes";
import { collectStats, DEFAULT_MAP_LABEL } from "@/lib/project-tree";
import { ANGLE_RANGE, DEPTH_RANGE, LENGTH_RANGE, useTreeStore } from "@/lib/tree-store";
import { cn } from "@/lib/cn";

const MAP_EXAMPLE = `{
  "name": "app",
  "kind": "dir",
  "children": [
    {
      "name": "src",
      "kind": "dir",
      "children": [
        { "name": "main.ts", "kind": "file" }
      ]
    }
  ]
}`;

function Field({
  label,
  value,
  unit,
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm text-fg-muted">{label}</label>
        <span className="font-mono text-xs tabular-nums text-fg">
          {value}
          {unit ? <span className="text-fg-subtle">{unit}</span> : null}
        </span>
      </div>
      {children}
    </div>
  );
}

export function ControlsPanel({ compact = false }: { compact?: boolean }) {
  const angle = useTreeStore((s) => s.angle);
  const depth = useTreeStore((s) => s.depth);
  const length = useTreeStore((s) => s.length);
  const seed = useTreeStore((s) => s.seed);
  const paletteId = useTreeStore((s) => s.paletteId);
  const ornaments = useTreeStore((s) => s.ornaments);
  const root = useTreeStore((s) => s.root);
  const mapLabel = useTreeStore((s) => s.mapLabel);
  const mapError = useTreeStore((s) => s.mapError);
  const hoveredId = useTreeStore((s) => s.hoveredId);
  const selectedId = useTreeStore((s) => s.selectedId);
  const setAngle = useTreeStore((s) => s.setAngle);
  const setDepth = useTreeStore((s) => s.setDepth);
  const setLength = useTreeStore((s) => s.setLength);
  const setPaletteId = useTreeStore((s) => s.setPaletteId);
  const setOrnaments = useTreeStore((s) => s.setOrnaments);
  const loadMap = useTreeStore((s) => s.loadMap);
  const resetMap = useTreeStore((s) => s.resetMap);
  const regenerate = useTreeStore((s) => s.regenerate);

  const focus = hoveredId ?? selectedId;
  const stats = collectStats(root);

  async function onMapFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    loadMap(await file.text(), file.name);
  }

  return (
    <div className={cn("flex flex-col gap-5", compact && "gap-4")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-wide text-fg-subtle uppercase">генерация</p>
          <p className="mt-1 font-display text-xl tracking-tight">Живая крона</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size={compact ? "sm" : "default"}
          onClick={regenerate}
          aria-label="Вырастить дерево заново"
        >
          <RefreshCw />
          Заново
        </Button>
      </div>

      <Field label="Угол ветвления" value={`${angle}`} unit="°">
        <Slider
          min={ANGLE_RANGE.min}
          max={ANGLE_RANGE.max}
          step={ANGLE_RANGE.step}
          value={[angle]}
          onValueChange={([v]) => setAngle(v ?? angle)}
          aria-label="Угол ветвления"
        />
      </Field>

      <Field label="Глубина" value={`${depth}`} unit=" ур.">
        <Slider
          min={DEPTH_RANGE.min}
          max={DEPTH_RANGE.max}
          step={DEPTH_RANGE.step}
          value={[depth]}
          onValueChange={([v]) => setDepth(v ?? depth)}
          aria-label="Глубина дерева"
        />
      </Field>

      <Field label="Длина ветвей" value={`${length}`} unit=" px">
        <Slider
          min={LENGTH_RANGE.min}
          max={LENGTH_RANGE.max}
          step={LENGTH_RANGE.step}
          value={[length]}
          onValueChange={([v]) => setLength(v ?? length)}
          aria-label="Длина ветвей"
        />
      </Field>

      <div className="space-y-2">
        <p className="text-sm text-fg-muted">Палитра</p>
        <div className="grid grid-cols-3 gap-2">
          {PALETTES.map((p) => {
            const active = p.id === paletteId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPaletteId(p.id)}
                className={cn(
                  "flex flex-col gap-2 rounded-md px-2 py-2 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out active:scale-[0.96]",
                  active && "shadow-[var(--shadow-border-hover)] bg-bg-subtle",
                )}
                aria-pressed={active}
                aria-label={`Палитра ${p.name}`}
              >
                <span className="flex h-2 overflow-hidden rounded-full">
                  {p.swatches.map((c) => (
                    <span key={c} className="h-full flex-1" style={{ background: c }} />
                  ))}
                </span>
                <span className="text-xs text-fg">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOrnaments(!ornaments)}
        className={cn(
          "rounded-md px-3 py-2 text-left text-sm shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out active:scale-[0.96]",
          ornaments && "bg-bg-subtle shadow-[var(--shadow-border-hover)]",
        )}
        aria-pressed={ornaments}
      >
        Декоративные ветки
      </button>

      <div className="space-y-2 border-t border-border pt-4">
        <label htmlFor="project-map-file" className="text-sm text-fg-muted">
          Своя карта
        </label>
        <input
          id="project-map-file"
          type="file"
          accept="application/json,.json"
          onChange={onMapFile}
          className="block w-full text-xs text-fg file:mr-3 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:text-secondary-foreground"
        />
        <p className="font-mono text-[11px] text-fg-subtle">{mapLabel}</p>
        {mapLabel !== DEFAULT_MAP_LABEL ? (
          <Button type="button" variant="secondary" size="sm" onClick={resetMap}>
            Вернуть карту проекта
          </Button>
        ) : null}
        {mapError ? <p className="text-sm text-red-500">{mapError}</p> : null}
        <details className="text-sm text-fg-muted">
          <summary className="cursor-pointer text-fg">Как составить файл</summary>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed">
            <li>Корень — один объект.</li>
            <li>name — непустая строка без слэшей.</li>
            <li>kind — только dir или file.</li>
            <li>У папки обязателен массив children. У файла этого поля нет.</li>
          </ul>
          <pre className="mt-2 overflow-x-auto rounded-md bg-bg-subtle p-2 font-mono text-[11px] leading-relaxed text-fg">
            {MAP_EXAMPLE}
          </pre>
        </details>
      </div>

      <div className="border-t border-border pt-4">
        <dl className="grid grid-cols-3 gap-2 text-center">
          <div>
            <dt className="text-[11px] text-fg-subtle">файлы</dt>
            <dd className="font-mono text-sm tabular-nums">{stats.files}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-fg-subtle">папки</dt>
            <dd className="font-mono text-sm tabular-nums">{stats.dirs}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-fg-subtle">seed</dt>
            <dd className="truncate font-mono text-sm tabular-nums">{seed.toString(16)}</dd>
          </div>
        </dl>
        <p className="mt-3 min-h-10 font-mono text-xs leading-relaxed text-fg-muted">
          {focus ?? "Наведите на ветвь — увидите путь в проекте."}
        </p>
      </div>
    </div>
  );
}
