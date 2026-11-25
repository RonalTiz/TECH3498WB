import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(
  process.env.SITE_ROOT || path.join(testsDirectory, "..")
);

export async function walkFiles(folder = projectRoot) {
  const entries = await readdir(folder, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const fullPath = path.join(folder, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(fullPath));
    else files.push(fullPath);
  }

  return files;
}

export async function readProjectFile(filePath) {
  return readFile(filePath, "utf8");
}

export async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function localTarget(sourceFile, rawTarget) {
  const target = rawTarget.trim();
  if (!target || /^(?:#|https?:|mailto:|tel:|data:|javascript:|blob:|\/\/)/i.test(target)) {
    return null;
  }

  const hashIndex = target.indexOf("#");
  const beforeHash = hashIndex >= 0 ? target.slice(0, hashIndex) : target;
  const queryIndex = beforeHash.indexOf("?");
  const pathPart = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  const hash = hashIndex >= 0 ? target.slice(hashIndex) : "";
  let pathname = decodeURIComponent(pathPart);
  if (!pathname || pathname === "/") pathname = "/index.html";

  const resolved = pathname.startsWith("/")
    ? path.resolve(projectRoot, `.${pathname}`)
    : path.resolve(path.dirname(sourceFile), pathname);

  const relative = path.relative(projectRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return { escaped: true, resolved, hash };
  }

  return { escaped: false, resolved, hash };
}

export async function loadChatHandler() {
  process.env.OPENAI_API_KEY ||= "test-only-placeholder-key";
  const modulePath = path.join(projectRoot, "api", "chat.js");
  const moduleUrl = `${pathToFileURL(modulePath).href}?test=${Date.now()}`;
  return (await import(moduleUrl)).default;
}

export async function invokeHandler(handler, req) {
  const result = { headers: {}, statusCode: 200, body: undefined };
  const res = {
    setHeader(name, value) {
      result.headers[name.toLowerCase()] = value;
      return this;
    },
    status(code) {
      result.statusCode = code;
      return this;
    },
    json(body) {
      result.body = body;
      return this;
    }
  };

  await handler(req, res);
  return result;
}
