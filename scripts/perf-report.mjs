import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { spawn } from "node:child_process";

const cwd = process.cwd();
const appRoot = path.join(cwd, ".next", "server", "app");
const port = Number(process.env.PERF_PORT || 3200);

const routes = [
  { label: "Homepage", pathname: "/", manifestPath: path.join(appRoot, "page_client-reference-manifest.js"), entryKey: "[project]/app/page" },
  { label: "Our School", pathname: "/our-school", manifestPath: path.join(appRoot, "our-school", "page_client-reference-manifest.js"), entryKey: "[project]/app/our-school/page" },
  { label: "Sixth Form", pathname: "/sixth-form", manifestPath: path.join(appRoot, "sixth-form", "page_client-reference-manifest.js"), entryKey: "[project]/app/sixth-form/page" },
  { label: "Parents", pathname: "/parents", manifestPath: path.join(appRoot, "parents", "page_client-reference-manifest.js"), entryKey: "[project]/app/parents/page" },
  { label: "Teaching & Learning", pathname: "/teaching-learning", manifestPath: path.join(appRoot, "teaching-learning", "page_client-reference-manifest.js"), entryKey: "[project]/app/teaching-learning/page" },
  { label: "Extracurricular", pathname: "/extracurricular", manifestPath: path.join(appRoot, "extracurricular", "page_client-reference-manifest.js"), entryKey: "[project]/app/extracurricular/page" },
];

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function formatMs(ms) {
  return `${ms.toFixed(1)} ms`;
}

async function loadRouteManifest(manifestPath, manifestKey) {
  const source = await readFile(manifestPath, "utf8");
  const context = { globalThis: { __RSC_MANIFEST: {} } };
  vm.runInNewContext(source, context);
  return context.globalThis.__RSC_MANIFEST[manifestKey];
}

async function getAssetSize(assetPath) {
  const normalized = assetPath.replace(/^\/_next\//, "").replace(/^_next\//, "");
  const filePath = path.join(cwd, ".next", normalized);
  const details = await stat(filePath);
  return details.size;
}

async function collectAssetSummary(route) {
  const manifest = await loadRouteManifest(route.manifestPath, `${route.pathname === "/" ? "/page" : `${route.pathname}/page`}`);
  const entryJSFiles = manifest?.entryJSFiles?.[route.entryKey] ?? [];
  const entryCSSFiles = (manifest?.entryCSSFiles?.[route.entryKey] ?? []).map((file) => file.path);

  const jsAssets = [...new Set(entryJSFiles)];
  const cssAssets = [...new Set(entryCSSFiles)];
  const jsSizes = await Promise.all(jsAssets.map(async (asset) => ({ asset, bytes: await getAssetSize(asset) })));
  const cssSizes = await Promise.all(cssAssets.map(async (asset) => ({ asset, bytes: await getAssetSize(asset) })));

  return {
    jsAssets: jsSizes,
    cssAssets: cssSizes,
    totalJsBytes: jsSizes.reduce((sum, item) => sum + item.bytes, 0),
    totalCssBytes: cssSizes.reduce((sum, item) => sum + item.bytes, 0),
  };
}

async function waitForServer(url, attempts = 60) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // keep trying until the server is ready
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function measureRoute(baseUrl, pathname) {
  const url = `${baseUrl}${pathname}`;
  const start = process.hrtime.bigint();
  const response = await fetch(url);
  const body = await response.text();
  const end = process.hrtime.bigint();
  return {
    status: response.status,
    durationMs: Number(end - start) / 1_000_000,
    htmlBytes: Buffer.byteLength(body),
  };
}

function buildMarkdown(reportRows) {
  const today = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const lines = [
    "# Performance Baseline",
    "",
    `Generated on ${today} from a local production build using \`next start\` and manifest analysis.`,
    "",
    "Limits:",
    "- This is not a Lighthouse/mobile CPU score because Chrome/Lighthouse are not installed on this machine.",
    "- These figures do measure route response time, HTML payload size, and route entry JS/CSS weight from the built app.",
    "",
    "| Route | Status | Response time | HTML size | Entry JS | Entry CSS |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const row of reportRows) {
    lines.push(
      `| ${row.label} | ${row.status} | ${formatMs(row.durationMs)} | ${formatKiB(row.htmlBytes)} | ${formatKiB(row.totalJsBytes)} | ${formatKiB(row.totalCssBytes)} |`
    );
  }

  lines.push("", "## Notes", "- Entry JS/CSS totals are route entry assets and can include shared chunks.", "- Compare future runs against this file after additional media or client-bundle reductions.");
  return `${lines.join("\n")}\n`;
}

async function main() {
  const startProc = spawn("npm", ["run", "start", "--", "--port", String(port)], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: String(port) },
  });

  let stderr = "";
  startProc.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForServer(`http://127.0.0.1:${port}/`);

    const rows = [];
    for (const route of routes) {
      const timing = await measureRoute(`http://127.0.0.1:${port}`, route.pathname);
      const assets = await collectAssetSummary(route);
      rows.push({
        label: route.label,
        ...timing,
        ...assets,
      });
    }

    const markdown = buildMarkdown(rows);
    const outputPath = path.join(cwd, "docs", "performance-baseline.md");
    await writeFile(outputPath, markdown, "utf8");

    process.stdout.write(markdown);
  } finally {
    startProc.kill("SIGTERM");
    await new Promise((resolve) => startProc.once("exit", resolve));
    if (stderr.trim()) {
      process.stderr.write(stderr);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
