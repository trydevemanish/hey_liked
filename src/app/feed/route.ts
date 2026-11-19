import { GET as getFeed } from "@/app/api/feed/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = getFeed;
