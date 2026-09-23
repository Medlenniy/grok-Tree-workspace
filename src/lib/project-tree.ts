import rawMap from "../map/project-map.json";

export type ProjectNode = {
  name: string;
  kind: "dir" | "file";
  ext?: string;
  children?: ProjectNode[];
};

export type MapParseResult = { ok: true; root: ProjectNode } | { ok: false; error: string };

const MAX_NODES = 8000;
const MAX_DEPTH = 40;

function file(name: string): ProjectNode {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot + 1) : undefined;
  return { name, kind: "file", ext };
}

function parseNode(
  data: unknown,
  where: string,
  depth: number,
  count: { n: number },
): ProjectNode | string {
  if (count.n >= MAX_NODES) return "В карте больше 8000 узлов.";
  if (depth > MAX_DEPTH) return "Слишком глубокая вложенность.";
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return `${where}: узел должен быть объектом.`;
  }
  const record = data as Record<string, unknown>;
  if (
    typeof record.name !== "string" ||
    record.name.length === 0 ||
    record.name.includes("/") ||
    record.name.includes("\\")
  ) {
    return `${where}: name — непустая строка без слэшей.`;
  }
  count.n += 1;
  if (record.kind === "file") {
    if ("children" in record && record.children !== undefined) {
      return `${where}: у файла «${record.name}» не должно быть children.`;
    }
    return file(record.name);
  }
  if (record.kind !== "dir") {
    return `${where}: kind у «${record.name}» может быть только dir или file.`;
  }
  if (!Array.isArray(record.children)) {
    return `${where}: у папки «${record.name}» нужен массив children.`;
  }
  const children: ProjectNode[] = [];
  for (let i = 0; i < record.children.length; i += 1) {
    const child = parseNode(record.children[i], `${where}/${record.name}[${i}]`, depth + 1, count);
    if (typeof child === "string") return child;
    children.push(child);
  }
  return { name: record.name, kind: "dir", children };
}

/** Проверяет JSON карты. Ошибка — текст для панели, без исключения. */
export function parseProjectMap(data: unknown): MapParseResult {
  const root = parseNode(data, "корень", 0, { n: 0 });
  if (typeof root === "string") return { ok: false, error: root };
  return { ok: true, root };
}

const parsedDefault = parseProjectMap(rawMap);
if (!parsedDefault.ok) {
  throw new Error(parsedDefault.error);
}

export const DEFAULT_MAP_LABEL = "карта проекта";
export const DEFAULT_ROOT: ProjectNode = parsedDefault.root;
export const PROJECT_ROOT: ProjectNode = DEFAULT_ROOT;

export type NodeStats = { files: number; dirs: number; maxDepth: number };

export function collectStats(node: ProjectNode, depth = 0): NodeStats {
  if (node.kind === "file") {
    return { files: 1, dirs: 0, maxDepth: depth };
  }
  let files = 0;
  let dirs = 1;
  let maxDepth = depth;
  for (const child of node.children ?? []) {
    const s = collectStats(child, depth + 1);
    files += s.files;
    dirs += s.dirs;
    maxDepth = Math.max(maxDepth, s.maxDepth);
  }
  return { files, dirs, maxDepth };
}

export function flattenTree(
  node: ProjectNode,
  path = "",
): { path: string; node: ProjectNode; depth: number }[] {
  const current = path ? `${path}/${node.name}` : node.name;
  const depth = current.split("/").length - 1;
  const rows = [{ path: current, node, depth }];
  for (const child of node.children ?? []) {
    rows.push(...flattenTree(child, current));
  }
  return rows;
}

export const PROJECT_STATS = collectStats(PROJECT_ROOT);

export const PROJECT_PAGES = [
  {
    to: "/pages/dashboard",
    title: "Дашборд",
    path: "src/routes/pages/dashboard.tsx",
    blurb: "Сводка метрик и активность репозитория.",
  },
  {
    to: "/pages/analytics",
    title: "Аналитика",
    path: "src/routes/pages/analytics.tsx",
    blurb: "Рост веток и распределение файлов.",
  },
  {
    to: "/pages/inbox",
    title: "Входящие",
    path: "src/routes/pages/inbox.tsx",
    blurb: "Задачи и ревью, связанные со структурой.",
  },
  {
    to: "/pages/docs",
    title: "Документация",
    path: "src/routes/pages/docs.tsx",
    blurb: "Как читается фрактальная карта проекта.",
  },
  {
    to: "/pages/team",
    title: "Команда",
    path: "src/routes/pages/team.tsx",
    blurb: "Кто работает с кроной кодовой базы.",
  },
  {
    to: "/pages/billing",
    title: "Биллинг",
    path: "src/routes/pages/billing.tsx",
    blurb: "Тарифы и использование рабочего пространства.",
  },
  {
    to: "/pages/profile",
    title: "Профиль",
    path: "src/routes/pages/profile.tsx",
    blurb: "Настройки автора и предпочтения атласа.",
  },
  {
    to: "/pages/settings",
    title: "Настройки",
    path: "src/routes/pages/settings.tsx",
    blurb: "Тема, палитра по умолчанию, доступность.",
  },
] as const;
