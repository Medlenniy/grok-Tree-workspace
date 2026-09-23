import { useEffect, useRef } from "react";
import { getPalette, type Palette } from "@/lib/palettes";
import {
  buildForest,
  growthDuration,
  measureRest,
  pathIds,
  pickBranch,
  sampleWorld,
  type Bounds,
  type Branch,
  type WorldBranch,
} from "@/lib/tree-engine";
import { useTreeStore } from "@/lib/tree-store";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type LeafParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  life: number;
  max: number;
};

type View = { scale: number; ox: number; oy: number };

function leafColor(palette: Palette, ext: string | undefined, hash: number) {
  if (ext === "tsx" || ext === "ts") return hash > 0.55 ? palette.leafB : palette.leafA;
  if (ext === "css") return palette.leafC;
  if (ext === "json" || ext === "md") return hash > 0.5 ? palette.leafC : palette.leafB;
  return hash > 0.66 ? palette.leafC : hash > 0.33 ? palette.leafB : palette.leafA;
}

function toView(x: number, y: number, view: View) {
  return { x: view.ox + x * view.scale, y: view.oy + y * view.scale };
}

function computeView(bounds: Bounds, width: number, height: number): View {
  const bw = Math.max(1, bounds.maxX - bounds.minX);
  const bh = Math.max(1, bounds.maxY - bounds.minY);
  const padX = width * 0.08;
  const padTop = Math.max(72, height * 0.16);
  const padBottom = Math.max(28, height * 0.08);
  const scale = Math.min((width - padX * 2) / bw, (height - padTop - padBottom) / bh) * 0.94;
  const ox = width / 2 - ((bounds.minX + bounds.maxX) / 2) * scale;
  const oy = height - padBottom - bounds.maxY * scale;
  return { scale, ox, oy };
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, palette: Palette) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, palette.skyTop);
  g.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const vg = ctx.createRadialGradient(
    w * 0.5,
    h * 0.22,
    20,
    w * 0.5,
    h * 0.4,
    Math.max(w, h) * 0.72,
  );
  vg.addColorStop(0, palette.fog);
  vg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
}

function drawGround(ctx: CanvasRenderingContext2D, w: number, h: number, palette: Palette) {
  const g = ctx.createLinearGradient(0, h * 0.78, 0, h);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, palette.ground);
  ctx.fillStyle = g;
  ctx.fillRect(0, h * 0.72, w, h * 0.28);
}

function drawBranch(
  ctx: CanvasRenderingContext2D,
  b: WorldBranch,
  view: View,
  palette: Palette,
  highlighted: boolean,
) {
  if (b.progress <= 0.01) return;
  const p1 = toView(b.x1, b.y1, view);
  const p2 = toView(b.x2, b.y2, view);
  const pc = toView(b.mx, b.my, view);
  const width = Math.max(0.6, b.thickness * (view.scale / 1.8));
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.quadraticCurveTo(pc.x, pc.y, p2.x, p2.y);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  if (b.depth < 2) ctx.strokeStyle = highlighted ? palette.highlight : palette.trunkHi;
  else if (b.kind === "fractal") ctx.strokeStyle = highlighted ? palette.highlight : palette.twig;
  else ctx.strokeStyle = highlighted ? palette.highlight : palette.branch;
  ctx.globalAlpha = 0.55 + b.progress * 0.45;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawLeaves(
  ctx: CanvasRenderingContext2D,
  b: WorldBranch,
  view: View,
  palette: Palette,
  t: number,
) {
  if (!b.isTerminal || b.progress < 0.55 || b.leafCount <= 0) return;
  const tip = toView(b.x2, b.y2, view);
  const bloom = Math.min(1, (b.progress - 0.55) / 0.45);
  const size = (3.2 + b.leafHash * 2.4) * bloom * Math.min(1.25, view.scale / 1.6);
  for (let i = 0; i < b.leafCount; i++) {
    const a =
      b.angle + (i - (b.leafCount - 1) / 2) * 0.42 + Math.sin(t * 0.8 + b.leafHash * 10 + i) * 0.08;
    const dist = size * (1.1 + (i % 3) * 0.45);
    const x = tip.x + Math.sin(a) * dist;
    const y = tip.y - Math.cos(a) * dist;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a + i * 0.5);
    ctx.fillStyle = leafColor(palette, b.ext, (b.leafHash + i * 0.13) % 1);
    ctx.globalAlpha = 0.55 + bloom * 0.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.55, size * 1.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  b: WorldBranch,
  view: View,
  palette: Palette,
  emphasize: boolean,
) {
  if (b.progress < 0.85) return;
  if (b.kind === "fractal") return;
  const show = emphasize || (b.kind === "dir" && b.depth <= 2 && b.depth >= 1);
  if (!show) return;
  const p = toView(b.x2, b.y2, view);
  ctx.save();
  ctx.font = `${emphasize ? 600 : 500} ${emphasize ? 12 : 10}px Figtree, system-ui, sans-serif`;
  ctx.fillStyle = palette.label;
  ctx.globalAlpha = emphasize ? 0.95 : 0.45;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const label = b.name;
  ctx.fillText(label, p.x + 8, p.y - 2);
  ctx.restore();
}

export function FractalCanvas({ preview = false }: { preview?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const angle = useTreeStore((s) => s.angle);
  const depth = useTreeStore((s) => s.depth);
  const length = useTreeStore((s) => s.length);
  const seed = useTreeStore((s) => s.seed);
  const ornaments = useTreeStore((s) => s.ornaments);
  const root = useTreeStore((s) => s.root);
  const setHoveredId = useTreeStore((s) => s.setHoveredId);
  const setSelectedId = useTreeStore((s) => s.setSelectedId);

  const previewAngle = preview ? 22 : angle;
  const previewDepth = preview ? 6 : depth;
  const previewLength = preview ? 86 : length;
  const previewSeed = preview ? 77 : seed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const params = {
      angle: previewAngle,
      depth: previewDepth,
      length: previewLength,
      seed: previewSeed,
      ornaments,
    };
    const branches: Branch[] = buildForest(root, params);
    const bounds = measureRest(branches);
    const duration = growthDuration(branches);

    let view: View = { scale: 1, ox: 0, oy: 0 };
    let width = 0;
    let height = 0;
    let world: WorldBranch[] = [];
    let raf = 0;
    let running = true;
    const start = performance.now();
    const particles: LeafParticle[] = [];
    let spawnAcc = 0;
    let last = start;

    const fit = () => {
      const parent = canvas.parentElement;
      const cssW = parent?.clientWidth ?? canvas.clientWidth;
      const cssH = parent?.clientHeight ?? canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, cssW);
      height = Math.max(1, cssH);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      view = computeView(bounds, width, height);
    };

    fit();
    const ro = new ResizeObserver(fit);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const toWorld = (cx: number, cy: number) => ({
      x: (cx - view.ox) / view.scale,
      y: (cy - view.oy) / view.scale,
    });

    const onMove = (ev: PointerEvent) => {
      if (preview) return;
      const rect = canvas.getBoundingClientRect();
      const { x, y } = toWorld(ev.clientX - rect.left, ev.clientY - rect.top);
      const hit = pickBranch(world, x, y, view.scale);
      const next = hit && hit.progress > 0.4 ? hit.nodeId : null;
      const current = useTreeStore.getState().hoveredId;
      if (next !== current) setHoveredId(next);
      canvas.style.cursor = next ? "pointer" : "default";
    };

    const onLeave = () => {
      if (!preview) setHoveredId(null);
    };

    const onClick = (ev: PointerEvent) => {
      if (preview) return;
      const rect = canvas.getBoundingClientRect();
      const { x, y } = toWorld(ev.clientX - rect.left, ev.clientY - rect.top);
      const hit = pickBranch(world, x, y, view.scale);
      setSelectedId(hit ? hit.nodeId : null);
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    const spawnLeaf = (dt: number, grown: boolean) => {
      if (!grown || preview || reduced) return;
      spawnAcc += dt;
      if (spawnAcc < 0.28 || particles.length > 28) return;
      spawnAcc = 0;
      const terminals = world.filter((b) => b.isTerminal && b.progress > 0.9);
      if (!terminals.length) return;
      const b = terminals[Math.floor(Math.random() * terminals.length)];
      const p = toView(b.x2, b.y2, view);
      const pal = getPalette(useTreeStore.getState().paletteId);
      particles.push({
        x: p.x,
        y: p.y,
        vx: (Math.random() - 0.55) * 18,
        vy: 8 + Math.random() * 16,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 2.4,
        size: 3 + Math.random() * 3,
        color: leafColor(pal, b.ext, b.leafHash),
        life: 0,
        max: 3.8 + Math.random() * 2.2,
      });
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const elapsed = (now - start) / 1000;
      const time = reduced ? 1e6 : elapsed;
      const windTime = reduced ? 0 : elapsed;
      world = sampleWorld(branches, time, windTime, reduced);
      const grown = reduced || elapsed > duration;
      spawnLeaf(dt, grown);

      const hover = useTreeStore.getState().hoveredId;
      const selected = useTreeStore.getState().selectedId;
      const pal = getPalette(useTreeStore.getState().paletteId);
      const hi = pathIds(world, hover ?? selected);

      ctx.clearRect(0, 0, width, height);
      drawSky(ctx, width, height, pal);
      drawGround(ctx, width, height, pal);

      const canopy = ctx.createRadialGradient(
        width * 0.5,
        height * 0.28,
        8,
        width * 0.5,
        height * 0.3,
        Math.max(width, height) * 0.45,
      );
      canopy.addColorStop(0, pal.glow);
      canopy.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = canopy;
      ctx.fillRect(0, 0, width, height);

      for (const b of world) {
        const highlighted = hi.has(b.id);
        if (highlighted) continue;
        drawBranch(ctx, b, view, pal, false);
      }
      for (const b of world) {
        if (!hi.has(b.id)) drawLeaves(ctx, b, view, pal, windTime);
      }
      for (const b of world) {
        if (!hi.has(b.id)) continue;
        drawBranch(ctx, b, view, pal, true);
        drawLeaves(ctx, b, view, pal, windTime);
      }
      for (const b of world) {
        const emphasize = b.nodeId === hover || b.nodeId === selected;
        if (b.kind === "dir" && b.depth <= 2) drawLabel(ctx, b, view, pal, emphasize);
        else if (emphasize) drawLabel(ctx, b, view, pal, true);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 22 * dt;
        p.x += Math.sin(p.life * 2.2 + p.rot) * 10 * dt;
        p.rot += p.vr * dt;
        const fade = 1 - p.life / p.max;
        if (fade <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = fade * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [
    preview,
    previewAngle,
    previewDepth,
    previewLength,
    previewSeed,
    ornaments,
    root,
    reduced,
    setHoveredId,
    setSelectedId,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full touch-none"
      aria-label={
        preview ? "Миниатюра фрактального дерева" : "Фрактальное дерево структуры проекта"
      }
    />
  );
}
