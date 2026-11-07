#!/usr/bin/env node
/**
 * Push variables from .env.local to the linked Vercel project (all environments).
 * NEXTAUTH_URL is set to the production URL on Production/Preview; local value on Development.
 */
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const project = process.env.VERCEL_PROJECT ?? "netflix-clone-next14";
const prodOrigin =
  process.env.VERCEL_PRODUCTION_URL ?? "https://netflix-clone-next14.vercel.app";
const skip = new Set(["VERCEL_OIDC_TOKEN"]);

function parseEnvFile(filePath) {
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function upsert(name, value, environment) {
  const base = ["env", "-p", project, "-y"];
  let r = spawnSync(
    "vercel",
    [...base, "update", name, "--environment", environment, "--value", value],
    { stdio: "inherit" }
  );
  if (r.status !== 0) {
    r = spawnSync(
      "vercel",
      [
        ...base,
        "add",
        name,
        "--environment",
        environment,
        "--force",
        "--value",
        value,
      ],
      { stdio: "inherit" }
    );
  }
  return r.status === 0;
}

const envPath = path.join(root, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local");
  process.exit(1);
}

const local = parseEnvFile(envPath);
let failed = 0;

for (const target of ["production", "preview", "development"]) {
  console.log(`\n--- ${target} ---`);
  for (const key of Object.keys(local).filter((k) => !skip.has(k))) {
    let value = local[key];
    if (key === "NEXTAUTH_URL" && target !== "development") {
      value = prodOrigin;
    }
    if (!upsert(key, value, target)) {
      console.error(`Failed: ${key} (${target})`);
      failed++;
    }
  }
}

process.exit(failed > 0 ? 1 : 0);
