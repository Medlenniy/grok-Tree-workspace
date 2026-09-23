import { create } from "zustand";
import {
  DEFAULT_MAP_LABEL,
  DEFAULT_ROOT,
  parseProjectMap,
  type ProjectNode,
} from "@/lib/project-tree";

const MAX_MAP_CHARS = 1_500_000;

export type TreeSettings = {
  angle: number;
  depth: number;
  length: number;
  seed: number;
  paletteId: string;
  ornaments: boolean;
  root: ProjectNode;
  mapLabel: string;
  mapError: string | null;
  hoveredId: string | null;
  selectedId: string | null;
};

type TreeActions = {
  setAngle: (angle: number) => void;
  setDepth: (depth: number) => void;
  setLength: (length: number) => void;
  setPaletteId: (paletteId: string) => void;
  setOrnaments: (ornaments: boolean) => void;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
  loadMap: (text: string, fileName: string) => void;
  resetMap: () => void;
  regenerate: () => void;
};

export const ANGLE_RANGE = { min: 10, max: 48, step: 1 } as const;
export const DEPTH_RANGE = { min: 3, max: 10, step: 1 } as const;
export const LENGTH_RANGE = { min: 56, max: 168, step: 1 } as const;

export const useTreeStore = create<TreeSettings & TreeActions>()((set) => ({
  angle: 24,
  depth: 7,
  length: 108,
  seed: 20260923,
  paletteId: "moss",
  ornaments: true,
  root: DEFAULT_ROOT,
  mapLabel: DEFAULT_MAP_LABEL,
  mapError: null,
  hoveredId: null,
  selectedId: null,
  setAngle: (angle) => set({ angle }),
  setDepth: (depth) => set({ depth }),
  setLength: (length) => set({ length }),
  setPaletteId: (paletteId) => set({ paletteId }),
  setOrnaments: (ornaments) => set({ ornaments }),
  setHoveredId: (hoveredId) => set({ hoveredId }),
  setSelectedId: (selectedId) => set({ selectedId }),
  loadMap: (text, fileName) => {
    if (text.length > MAX_MAP_CHARS) {
      set({ mapError: "Файл слишком большой." });
      return;
    }
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      set({ mapError: "Файл не является JSON." });
      return;
    }
    const result = parseProjectMap(data);
    if (!result.ok) {
      set({ mapError: result.error });
      return;
    }
    set({
      root: result.root,
      mapLabel: fileName || "файл",
      mapError: null,
      hoveredId: null,
      selectedId: null,
    });
  },
  resetMap: () =>
    set({
      root: DEFAULT_ROOT,
      mapLabel: DEFAULT_MAP_LABEL,
      mapError: null,
      hoveredId: null,
      selectedId: null,
    }),
  regenerate: () =>
    set({
      seed: (Math.floor(Math.random() * 0x7fffffff) + 1) >>> 0,
      hoveredId: null,
      selectedId: null,
    }),
}));
