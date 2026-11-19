import database from "@/lib/db";
import { DEMO_USER_ID } from "@/lib/constants";
import type { SwipeAction } from "@/types/profile";

// export const runtime = "nodejs";

type SwipeRequest = {
  profileId: number;
  action: SwipeAction;
};

type SwipeResult =
  | { error: "invalid_profile" | "already_swiped" }
  | { action: SwipeAction; match: boolean; profileId: number };

function isSwipeRequest(value: unknown): value is SwipeRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const request = value as Record<string, unknown>;
  return (
    Number.isInteger(request.profileId) &&
    (request.profileId as number) > 0 &&
    (request.action === "like" || request.action === "pass")
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!isSwipeRequest(body)) {
    return Response.json(
      { error: "Provide a valid profileId and an action of like or pass." },
      { status: 400 },
    );
  }

  const { profileId, action } = body;
  const swipe = database.transaction((): SwipeResult => {
    const profile = database
      .prepare("SELECT id FROM users WHERE id = ? AND id <> ?")
      .get(profileId, DEMO_USER_ID);

    if (!profile) {
      return { error: "invalid_profile" };
    }

    const previousSwipe = database
      .prepare(`
        SELECT
          EXISTS (
            SELECT 1 FROM liked
            WHERE liked_by = @demoUserId AND liked_to = @profileId
          )
          OR EXISTS (
            SELECT 1 FROM disliked
            WHERE disliked_by = @demoUserId AND disliked_to = @profileId
          ) AS swiped
      `)
      .get({ demoUserId: DEMO_USER_ID, profileId }) as { swiped: number };

    if (previousSwipe.swiped) {
      return { error: "already_swiped" };
    }

    if (action === "like") {
      database
        .prepare("INSERT INTO liked (liked_by, liked_to) VALUES (?, ?)")
        .run(DEMO_USER_ID, profileId);

      const { matched } = database
        .prepare(`
          SELECT EXISTS (
            SELECT 1 FROM liked
            WHERE liked_by = @profileId AND liked_to = @demoUserId
          ) AS matched
        `)
        .get({ profileId, demoUserId: DEMO_USER_ID }) as { matched: number };

      return { action, match: Boolean(matched), profileId };
    }

    database
      .prepare("INSERT INTO disliked (disliked_by, disliked_to) VALUES (?, ?)")
      .run(DEMO_USER_ID, profileId);

    return { action, match: false, profileId };
  });

  const result = swipe();
  if ("error" in result) {
    const status = result.error === "invalid_profile" ? 404 : 409;
    return Response.json({ error: result.error }, { status });
  }

  return Response.json(result);
}
