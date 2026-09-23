import type { ProjectNode } from "./project-tree";

export type TreeParams = {
  angle: number;
  depth: number;
  length: number;
  seed: number;
  ornaments: boolean;
};

export type Branch = {
  id: number;
  parentId: number | null;
  length: number;
  restAngle: number;
  curve: number;
  thickness: number;
  depth: number;
  appearAt: number;
  growFor: number;
  nodeId: string;
  path: string;
  name: string;
  kind: "dir" | "file" | "fractal";
  ext?: string;
  isTerminal: boolean;
  leafHash: number;
  leafCount: number;
};

export type WorldBranch = Branch & {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mx: number;
  my: number;
  angle: number;
  progress: number;
};

export type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

const MAX_BRANCHES = 2400;
const EXTRA_FRACTAL = 4;

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeOutCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

function joinPath(base: string, name: string) {
  return base ? `${base}/${name}` : name;
}

export function buildForest(root: ProjectNode, params: TreeParams): Branch[] {
  const rng = mulberry32(params.seed);
  const branches: Branch[] = [];
  const spread0 = (params.angle * Math.PI) / 180;
  let nextId = 0;

  const add = (partial: Omit<Branch, "id">): Branch => {
    const b: Branch = { id: nextId++, ...partial };
    branches.push(b);
    return b;
  };

  const growFractal = (
    parent: Branch,
    extraLeft: number,
    length: number,
    path: string,
    name: string,
    ext: string | undefined,
    nodeId: string,
  ) => {
    if (extraLeft <= 0 || branches.length >= MAX_BRANCHES) return;
    for (const sign of [-1, 1] as const) {
      if (branches.length >= MAX_BRANCHES) return;
      const rel = sign * spread0 * (0.62 + rng() * 0.55);
      const len = length * (0.62 + rng() * 0.14);
      const depth = parent.depth + 1;
      const child = add({
        parentId: parent.id,
        length: len,
        restAngle: rel,
        curve: (rng() - 0.5) * len * 0.28,
        thickness: Math.max(0.55, parent.thickness * 0.68),
        depth,
        appearAt: parent.appearAt + parent.growFor - 0.06 + rng() * 0.04,
        growFor: 0.22 + len / 420,
        nodeId,
        path,
        name,
        kind: "fractal",
        ext,
        isTerminal: extraLeft <= 1,
        leafHash: rng(),
        leafCount: extraLeft <= 1 ? 3 + Math.floor(rng() * 4) : 0,
      });
      growFractal(child, extraLeft - 1, len, path, name, ext, nodeId);
    }
  };

  const walk = (
    node: ProjectNode,
    parent: Branch | null,
    depth: number,
    relAngle: number,
    length: number,
    path: string,
    appearAt: number,
  ) => {
    if (depth > params.depth || branches.length >= MAX_BRANCHES) return;
    const fullPath = joinPath(path, node.name);
    const thickness = Math.max(0.7, 12.5 * 0.73 ** depth);
    const growFor = 0.26 + length / 380;
    const self = add({
      parentId: parent?.id ?? null,
      length,
      restAngle: relAngle,
      curve: (rng() - 0.5) * length * (depth === 0 ? 0.04 : 0.32),
      thickness,
      depth,
      appearAt,
      growFor,
      nodeId: fullPath,
      path: fullPath,
      name: node.name,
      kind: node.kind,
      ext: node.ext,
      isTerminal: false,
      leafHash: rng(),
      leafCount: 0,
    });

    const kids = node.children ?? [];
    const childStart = appearAt + growFor - 0.07;

    if (depth >= params.depth) {
      self.isTerminal = true;
      self.leafCount = node.kind === "file" ? 4 + Math.floor(rng() * 4) : 2;
      return;
    }

    if (node.kind === "file" || kids.length === 0) {
      self.isTerminal = true;
      self.leafCount = 4 + Math.floor(rng() * 5);
      if (params.ornaments) {
        const extra = Math.min(params.depth - depth, EXTRA_FRACTAL);
        if (extra > 0)
          growFractal(self, extra, length * 0.7, fullPath, node.name, node.ext, fullPath);
      }
      return;
    }

    const n = kids.length;
    const fan = spread0 * (n === 1 ? 0.22 : Math.min(1.35, 0.55 + n * 0.09));
    kids.forEach((child, i) => {
      const t = n === 1 ? (rng() - 0.5) * 0.35 : (i / Math.max(1, n - 1)) * 2 - 1;
      const childRel = t * fan + (rng() - 0.5) * spread0 * 0.14;
      const dense = n > 6 ? 0.9 : 1;
      const childLen = length * (0.6 + rng() * 0.18) * dense;
      walk(child, self, depth + 1, childRel, childLen, fullPath, childStart + i * 0.018);
    });
  };

  walk(root, null, 0, 0, params.length, "", 0.05);
  return branches;
}

export function sampleWorld(
  branches: Branch[],
  time: number,
  windTime: number,
  reducedMotion: boolean,
): WorldBranch[] {
  const world: WorldBranch[] = new Array(branches.length);
  for (const b of branches) {
    const parent = b.parentId === null ? null : world[b.parentId];
    let raw = reducedMotion ? 1 : (time - b.appearAt) / b.growFor;
    if (parent && parent.progress < 0.72) raw = 0;
    const progress = easeOutCubic(raw);
    const windAmp = reducedMotion ? 0 : 0.03 * (0.35 + b.depth * 0.12);
    const wind =
      Math.sin(windTime * (0.55 + b.leafHash * 0.4) + b.leafHash * 12 + b.depth) * windAmp;
    const angle = (parent ? parent.angle : 0) + b.restAngle + wind * progress;
    const x1 = parent ? parent.x2 : 0;
    const y1 = parent ? parent.y2 : 0;
    const drawLen = b.length * progress;
    const x2 = x1 + Math.sin(angle) * drawLen;
    const y2 = y1 - Math.cos(angle) * drawLen;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    const mx = (x1 + x2) / 2 + nx * b.curve * progress;
    const my = (y1 + y2) / 2 + ny * b.curve * progress;
    world[b.id] = { ...b, x1, y1, x2, y2, mx, my, angle, progress };
  }
  return world;
}

export function measureRest(branches: Branch[]): Bounds {
  const world = sampleWorld(branches, 1e6, 0, true);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const b of world) {
    if (b.progress <= 0) continue;
    minX = Math.min(minX, b.x1, b.x2, b.mx);
    maxX = Math.max(maxX, b.x1, b.x2, b.mx);
    minY = Math.min(minY, b.y1, b.y2, b.my);
    maxY = Math.max(maxY, b.y1, b.y2, b.my);
  }
  if (!Number.isFinite(minX)) return { minX: -1, minY: -1, maxX: 1, maxY: 1 };
  const pad = Math.max(18, (maxX - minX) * 0.08);
  return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
}

export function growthDuration(branches: Branch[]) {
  let max = 1.2;
  for (const b of branches) max = Math.max(max, b.appearAt + b.growFor);
  return max + 0.4;
}

export function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 < 1e-6) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

export function pickBranch(world: WorldBranch[], px: number, py: number, scale: number) {
  let best: WorldBranch | null = null;
  let bestD = Infinity;
  const pixel = 12 / Math.max(scale, 0.001);
  for (let i = world.length - 1; i >= 0; i--) {
    const b = world[i];
    if (b.progress < 0.35) continue;
    const thresh = Math.max(pixel, b.thickness * 0.85);
    const d = distToSegment(px, py, b.x1, b.y1, b.x2, b.y2);
    if (d < thresh && d < bestD) {
      best = b;
      bestD = d;
    }
  }
  return best;
}

export function pathIds(world: WorldBranch[], nodeId: string | null) {
  const set = new Set<number>();
  if (!nodeId) return set;
  let current =
    [...world].reverse().find((b) => b.nodeId === nodeId && b.kind !== "fractal") ??
    world.find((b) => b.nodeId === nodeId);
  while (current) {
    set.add(current.id);
    current = current.parentId === null ? undefined : world[current.parentId];
  }
  return set;
}
