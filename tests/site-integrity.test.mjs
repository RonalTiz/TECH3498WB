import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import {
  fileExists,
  localTarget,
  projectRoot,
  readProjectFile,
  walkFiles
} from "./helpers.mjs";

const allFiles = await walkFiles();
const htmlFiles = allFiles.filter(file => file.toLowerCase().endsWith(".html"));
const sourceFiles = allFiles.filter(file => /\.(?:js|mjs|css)$/i.test(file));

function attributes(markup, name) {
  const values = [];
  const expression = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "gi");
  for (const match of markup.matchAll(expression)) values.push(match[2]);
  return values;
}

test("website project and primary pages exist", async () => {
  assert.ok(await fileExists(path.join(projectRoot, "index.html")), "index.html is missing");
  assert.ok(htmlFiles.length >= 5, `expected site pages under ${projectRoot}`);
});

test("HTML links and local assets resolve inside the project", async t => {
  const problems = [];

  for (const file of htmlFiles) {
    const markup = await readProjectFile(file);
    for (const attr of ["href", "src", "poster"]) {
      for (const rawTarget of attributes(markup, attr)) {
        const target = localTarget(file, rawTarget);
        if (!target) continue;
        if (target.escaped) {
          problems.push(`${path.relative(projectRoot, file)}: ${attr} escapes site folder: ${rawTarget}`);
        } else if (!(await fileExists(target.resolved))) {
          problems.push(`${path.relative(projectRoot, file)}: missing ${attr}: ${rawTarget}`);
        } else if (target.hash && /\.html?$/i.test(target.resolved)) {
          const linkedMarkup = await readProjectFile(target.resolved);
          const linkedIds = new Set(attributes(linkedMarkup, "id"));
          const fragment = decodeURIComponent(target.hash.slice(1));
          if (!linkedIds.has(fragment)) {
            problems.push(`${path.relative(projectRoot, file)}: ${rawTarget} has no #${fragment} target`);
          }
        }
      }
    }
  }

  assert.deepEqual(problems, [], problems.join("\n"));
  t.diagnostic(`checked ${htmlFiles.length} HTML files`);
});

test("same-page fragment links point to an element id", async () => {
  const problems = [];

  for (const file of htmlFiles) {
    const markup = await readProjectFile(file);
    const ids = new Set(attributes(markup, "id"));
    for (const href of attributes(markup, "href")) {
      if (!href.startsWith("#") || href.length < 2) continue;
      const id = decodeURIComponent(href.slice(1));
      if (!ids.has(id)) problems.push(`${path.relative(projectRoot, file)}: missing #${id}`);
    }
  }

  assert.deepEqual(problems, [], problems.join("\n"));
});

test("literal local navigation and fetch targets resolve", async () => {
  const problems = [];
  const expressions = [
    /\bfetch\s*\(\s*(["'])(\/[^"']*)\1/g,
    /\b(?:href|location\.href)\s*=\s*(["'])(\.\.?(?:\/[^"']*)?|\/[^"']*)\1/g,
    /\blocation\.replace\s*\(\s*(["'])(\.\.?(?:\/[^"']*)?|\/[^"']*)\1/g
  ];
  const filesToScan = [...new Set([...sourceFiles, ...htmlFiles])];

  for (const file of filesToScan) {
    const source = await readProjectFile(file);
    for (const expression of expressions) {
      for (const match of source.matchAll(expression)) {
        const rawTarget = match[2];
        const target = localTarget(file, rawTarget);
        if (!target || target.escaped) {
          problems.push(`${path.relative(projectRoot, file)}: unsafe local target ${rawTarget}`);
          continue;
        }

        // Vercel maps /api/name to api/name.js.
        const resolved = target.resolved;
        const apiFile = resolved.startsWith(path.join(projectRoot, "api")) && !path.extname(resolved)
          ? `${resolved}.js`
          : resolved;
        if (!(await fileExists(apiFile))) {
          problems.push(`${path.relative(projectRoot, file)}: missing route target ${rawTarget}`);
        }
      }
    }
  }

  assert.deepEqual(problems, [], problems.join("\n"));
});
