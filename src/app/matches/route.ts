import { GET as getMatches } from "@/app/api/matches/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = getMatches;
