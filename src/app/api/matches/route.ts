import database from "@/lib/db";
import { DEMO_USER_ID } from "@/lib/constants";
import type { MatchProfile } from "@/types/profile";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

type MatchRow = Omit<MatchProfile, "interests"> & {
  interests: string;
};

export function GET() {
  const rows = database
    .prepare(`
      SELECT
        profile.id,
        profile.name,
        profile.age,
        profile.photo,
        profile.short_bio AS shortBio,
        profile.city,
        profile.interests,
        outgoing.created_at AS matchedAt
      FROM liked AS outgoing
      INNER JOIN liked AS incoming
        ON incoming.liked_by = outgoing.liked_to
        AND incoming.liked_to = outgoing.liked_by
      INNER JOIN users AS profile
        ON profile.id = outgoing.liked_to
      WHERE outgoing.liked_by = @demoUserId
        AND outgoing.liked_to <> @demoUserId
      ORDER BY outgoing.created_at DESC, profile.id
    `)
    .all({ demoUserId: DEMO_USER_ID }) as MatchRow[];

  const matches: MatchProfile[] = rows.map((row) => ({
    ...row,
    interests: JSON.parse(row.interests) as string[],
  }));

  return Response.json({ matches });
}
