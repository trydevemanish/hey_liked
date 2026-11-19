import database from "@/lib/db";

export const runtime = "nodejs";

export function GET() {
  const { version } = database
    .prepare("SELECT sqlite_version() AS version")
    .get() as { version: string };

  return Response.json({ status: "ok", database: "sqlite", version });
}
