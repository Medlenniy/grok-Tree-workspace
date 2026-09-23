#!/usr/bin/env node
/**
 * Write src/map/project-map.json from the working tree.
 *
 * Manual only (`npm run map`). Do not hook this into dev or build — the
 * committed file is the map the app ships, and a developer is expected to
 * edit it after generation.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set([
  "node_modules",
  ".git",
  "dist",
  ".vercel",
  ".tanstack",
  "artifacts",
  "coverage",
  ".grok",
]);

function shouldSkip(name) {
  return name.startsWith(".") || SKIP.has(name);
}

function walk(dir) {
  const children = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (shouldSkip(entry.name) || entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      children.push({
        name: entry.name,
        kind: "dir",
        children: walk(join(dir, entry.name)),
      });
    } else if (entry.isFile()) {
      children.push({ name: entry.name, kind: "file" });
    }
  }
  children.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name, "en");
  });
  return children;
}

const tree = {
  name: basename(repoRoot),
  kind: "dir",
  children: walk(repoRoot),
};

const outDir = join(repoRoot, "src", "map");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "project-map.json");
writeFileSync(outFile, `${JSON.stringify(tree, null, 2)}\n`);
console.log(`wrote ${outFile}`);
