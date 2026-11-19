import database from "@/lib/db";
import { DEMO_USER_ID } from "@/lib/constants";
import type { Profile } from "@/types/profile";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

type ProfileRow = Omit<Profile, "interests"> & {
  interests: string;
};

export function GET() {
  const rows = database
    .prepare(`
      SELECT
        user.id,
        user.name,
        user.age,
        user.photo,
        user.short_bio AS shortBio,
        user.city,
        user.interests
      FROM users AS user
      WHERE user.id <> @demoUserId
        AND NOT EXISTS (
          SELECT 1
          FROM liked
          WHERE liked.liked_by = @demoUserId
            AND liked.liked_to = user.id
        )
        AND NOT EXISTS (
          SELECT 1
          FROM disliked
          WHERE disliked.disliked_by = @demoUserId
            AND disliked.disliked_to = user.id
        )
      ORDER BY user.id
    `)
    .all({ demoUserId: DEMO_USER_ID }) as ProfileRow[];

  const profiles: Profile[] = rows.map((row) => ({
    ...row,
    interests: JSON.parse(row.interests) as string[],
  }));

  return Response.json({ profiles });
}
