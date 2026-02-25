#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, "public");
const teachingLearningPath = path.join(repoRoot, "app", "teaching-learning", "page.tsx");

const args = new Set(process.argv.slice(2));
const shouldDelete = args.has("--delete");

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".md",
  ".html",
  ".yml",
  ".yaml",
  ".toml",
]);

const ALWAYS_KEEP = new Set([
  "favicon.ico",
  "apple-touch-icon.png",
]);

function encodeSpaces(value) {
  return value.replaceAll(" ", "%20");
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

async function loadTextCorpus(files) {
  const chunks = [];
  for (const file of files) {
    const ext = path.extname(file);
    if (!TEXT_EXTENSIONS.has(ext)) continue;
    try {
      const content = await fs.readFile(file, "utf8");
      chunks.push(content);
    } catch {
      // Skip unreadable files.
    }
  }
  return chunks.join("\n");
}

async function dynamicTeachingLearningAssets() {
  try {
    const source = await fs.readFile(teachingLearningPath, "utf8");
    const ids = [...source.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
    return new Set(ids.map((id) => `/images/${id}.webp`));
  } catch {
    return new Set();
  }
}

async function main() {
  const allFiles = await walk(repoRoot);
  const corpus = await loadTextCorpus(allFiles);
  const dynamicRefs = await dynamicTeachingLearningAssets();

  const publicFiles = await walk(publicDir);
  const unused = [];

  for (const full of publicFiles) {
    const rel = path.relative(publicDir, full).replaceAll(path.sep, "/");

    if (rel.endsWith(".DS_Store")) continue;
    if (ALWAYS_KEEP.has(rel)) continue;
    if (rel.startsWith("morpeth-icon-pack/")) continue;

    const absoluteRef = `/${rel}`;
    const encodedRef = `/${encodeSpaces(rel)}`;
    const usedByDynamic = dynamicRefs.has(absoluteRef);
    const usedByLiteral =
      corpus.includes(absoluteRef) || (encodedRef !== absoluteRef && corpus.includes(encodedRef));

    if (!usedByDynamic && !usedByLiteral) {
      unused.push({ rel, full });
    }
  }

  if (unused.length === 0) {
    console.log("No unused public assets found.");
    return;
  }

  if (shouldDelete) {
    for (const file of unused) {
      await fs.unlink(file.full);
      console.log(`deleted ${file.rel}`);
    }
    console.log(`Deleted ${unused.length} file(s).`);
    return;
  }

  console.log(`Found ${unused.length} potentially unused public asset(s):`);
  for (const file of unused) {
    console.log(file.rel);
  }
  console.log("\nRun with --delete to remove them.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
