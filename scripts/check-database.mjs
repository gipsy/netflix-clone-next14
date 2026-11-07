import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  for (const name of [".env.local", ".env"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    const line = fs
      .readFileSync(file, "utf8")
      .split("\n")
      .find((l) => l.startsWith("DATABASE_URL="));
    if (!line) continue;
    return line.replace(/^DATABASE_URL=/, "").trim().replace(/^"|"$/g, "");
  }
  return null;
}

function diagnoseUrl(url) {
  try {
    const parsed = new URL(url.replace(/^postgres:/, "postgresql:"));
    try {
      decodeURIComponent(parsed.password);
    } catch {
      console.error(
        "DATABASE_URL password looks malformed (invalid % sequences). Copy a fresh URI from Supabase → Connect → Prisma, or URL-encode the password."
      );
    }
    if (!parsed.searchParams.has("sslmode")) {
      console.warn(
        "Tip: append ?sslmode=require to DATABASE_URL for Supabase."
      );
    }
    console.log(`Host: ${parsed.hostname}:${parsed.port || "5432"}`);
  } catch (e) {
    console.error("DATABASE_URL is not a valid URL:", e.message);
  }
}

const url = loadDatabaseUrl();
if (!url) {
  console.error("No DATABASE_URL in environment or .env.local");
  process.exit(1);
}

process.env.DATABASE_URL = url;
diagnoseUrl(url);

const prisma = new PrismaClient();
try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("Database connection OK.");
} catch (e) {
  console.error(e.message);
  console.error(
    "\nIf you use Supabase: open the project in the dashboard, ensure it is not paused, then reset or copy the connection string (Session pooler, port 5432) and update .env.local / Vercel env."
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
