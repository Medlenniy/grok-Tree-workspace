export type Palette = {
  id: string;
  name: string;
  swatches: [string, string, string];
  skyTop: string;
  skyBottom: string;
  fog: string;
  trunk: string;
  trunkHi: string;
  branch: string;
  twig: string;
  leafA: string;
  leafB: string;
  leafC: string;
  glow: string;
  label: string;
  ground: string;
  highlight: string;
};

export const PALETTES: Palette[] = [
  {
    id: "moss",
    name: "Мох",
    swatches: ["#3d4a32", "#7d9170", "#c5d4b0"],
    skyTop: "#141812",
    skyBottom: "#0b0c0a",
    fog: "rgba(180, 196, 160, 0.08)",
    trunk: "#3a3228",
    trunkHi: "#6a5a46",
    branch: "#4c4336",
    twig: "#6e7a5c",
    leafA: "#6f8458",
    leafB: "#9aaf7a",
    leafC: "#c5d6a0",
    glow: "rgba(154, 175, 122, 0.22)",
    label: "#e6e1d4",
    ground: "#1a1814",
    highlight: "#d7e6b8",
  },
  {
    id: "ink",
    name: "Чернила",
    swatches: ["#2a2a2a", "#8a8a86", "#e8e4dc"],
    skyTop: "#121212",
    skyBottom: "#070707",
    fog: "rgba(220, 216, 208, 0.07)",
    trunk: "#2c2c2c",
    trunkHi: "#5a5a58",
    branch: "#4a4a48",
    twig: "#8a8a86",
    leafA: "#9c9a94",
    leafB: "#d4d0c6",
    leafC: "#f2eee6",
    glow: "rgba(232, 228, 220, 0.16)",
    label: "#f0ece4",
    ground: "#141414",
    highlight: "#ffffff",
  },
  {
    id: "ember",
    name: "Уголь",
    swatches: ["#3a2a22", "#a86a48", "#e8c4a0"],
    skyTop: "#16110f",
    skyBottom: "#0b0908",
    fog: "rgba(232, 176, 128, 0.08)",
    trunk: "#2c221c",
    trunkHi: "#6a4a38",
    branch: "#5a3c2c",
    twig: "#a86a48",
    leafA: "#b45a38",
    leafB: "#d49262",
    leafC: "#efd0a8",
    glow: "rgba(212, 146, 98, 0.22)",
    label: "#f0e4d4",
    ground: "#181210",
    highlight: "#ffd8b0",
  },
  {
    id: "frost",
    name: "Иней",
    swatches: ["#2a3844", "#7a9aac", "#d8e8f0"],
    skyTop: "#10161a",
    skyBottom: "#080b0d",
    fog: "rgba(180, 210, 224, 0.09)",
    trunk: "#2a3238",
    trunkHi: "#4a5c68",
    branch: "#3a4c58",
    twig: "#6a8898",
    leafA: "#6a8a9c",
    leafB: "#a8c4d0",
    leafC: "#e4f0f4",
    glow: "rgba(168, 196, 208, 0.2)",
    label: "#e6eef2",
    ground: "#121618",
    highlight: "#f2f8fa",
  },
  {
    id: "dusk",
    name: "Сумерки",
    swatches: ["#243836", "#4a8a82", "#b8dcd4"],
    skyTop: "#101616",
    skyBottom: "#080a0a",
    fog: "rgba(120, 180, 172, 0.08)",
    trunk: "#24302e",
    trunkHi: "#3a5450",
    branch: "#2e4440",
    twig: "#4a7a72",
    leafA: "#3e7a72",
    leafB: "#6aada4",
    leafC: "#c4e8e0",
    glow: "rgba(106, 173, 164, 0.2)",
    label: "#e4eeec",
    ground: "#121616",
    highlight: "#d4f4ee",
  },
  {
    id: "dawn",
    name: "Рассвет",
    swatches: ["#4a322e", "#c48a7a", "#f0d4c8"],
    skyTop: "#181210",
    skyBottom: "#0c0a09",
    fog: "rgba(232, 196, 184, 0.08)",
    trunk: "#322824",
    trunkHi: "#6a4e46",
    branch: "#4a3834",
    twig: "#a07064",
    leafA: "#b07064",
    leafB: "#d4a090",
    leafC: "#f2dcd2",
    glow: "rgba(212, 160, 144, 0.2)",
    label: "#f2e8e0",
    ground: "#161210",
    highlight: "#ffe8de",
  },
];

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
