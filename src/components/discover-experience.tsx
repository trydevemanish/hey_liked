"use client";

import TinderCard from "react-tinder-card";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProfileCard } from "@/components/profile-card";
import type { Profile } from "@/types/profile";

type Direction = "left" | "right" | "up" | "down";
type SwipeResult = {
  action: "like" | "pass";
  match: boolean;
  profileId: number;
};
type SwipeOperation = {
  leftScreen: boolean;
  result?: SwipeResult;
  error?: string;
};
type TinderCardHandle = {
  swipe: (direction?: Direction) => Promise<void>;
  restoreCard: () => Promise<void>;
};

async function fetchFeed(): Promise<Profile[]> {
  const response = await fetch("/api/feed");
  if (!response.ok) {
    throw new Error("Profiles could not be loaded. Please try again.");
  }

  const data = (await response.json()) as { profiles: Profile[] };
  return data.profiles;
}

export function DiscoverExperience() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [notice, setNotice] = useState("");
  const [swipeIntent, setSwipeIntent] = useState<"left" | "right" | null>(
    null,
  );
  const [deckVersion, setDeckVersion] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const topCardRef = useRef<TinderCardHandle | null>(null);
  const operations = useRef(new Map<number, SwipeOperation>());
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    let active = true;

    void fetchFeed()
      .then((result) => {
        if (active) {
          setProfiles(result);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setFeedError(
            error instanceof Error
              ? error.message
              : "Profiles could not be loaded. Please try again.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const recoverDeck = useCallback(async () => {
    try {
      setProfiles(await fetchFeed());
      setDeckVersion((version) => version + 1);
      setFeedError("");
    } catch (error: unknown) {
      setFeedError(
        error instanceof Error
          ? error.message
          : "The deck could not be restored. Please refresh the page.",
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, []);

  const completeSwipe = useCallback(
    (profile: Profile, operation: SwipeOperation) => {
      if (!operation.leftScreen || (!operation.result && !operation.error)) {
        return;
      }

      operations.current.delete(profile.id);
      setSwipeIntent(null);

      if (operation.error) {
        setNotice(operation.error);
        void recoverDeck();
        return;
      }

      const result = operation.result;
      if (!result) {
        return;
      }

      setProfiles((current) =>
        current.filter((candidate) => candidate.id !== profile.id),
      );
      setNotice(
        result.action === "like"
          ? `You liked ${profile.name}.`
          : `You passed on ${profile.name}.`,
      );
      if (result.match) {
        setMatchedProfile(profile);
      }
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    },
    [recoverDeck],
  );

  const handleSwipe = useCallback(
    (profile: Profile, direction: Direction) => {
      if (direction !== "left" && direction !== "right") {
        return;
      }
      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setSwipeIntent(direction);

      const operation: SwipeOperation = { leftScreen: false };
      operations.current.set(profile.id, operation);
      const action = direction === "right" ? "like" : "pass";

      void (async () => {
        try {
          const response = await fetch("/api/swipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileId: profile.id, action }),
          });
          const data = (await response.json()) as
            | SwipeResult
            | { error: string };

          if (!response.ok || "error" in data) {
            throw new Error(
              "error" in data
                ? `Swipe could not be saved: ${data.error}.`
                : "Swipe could not be saved. Please try again.",
            );
          }

          operation.result = data;
        } catch (error: unknown) {
          operation.error =
            error instanceof Error
              ? error.message
              : "Swipe could not be saved. Please try again.";
        }

        completeSwipe(profile, operation);
      })();
    },
    [completeSwipe],
  );

  const handleCardLeftScreen = useCallback(
    (profile: Profile) => {
      const operation = operations.current.get(profile.id);
      if (!operation) {
        return;
      }

      operation.leftScreen = true;
      completeSwipe(profile, operation);
    },
    [completeSwipe],
  );

  const triggerSwipe = useCallback((direction: "left" | "right") => {
    if (isSubmittingRef.current) {
      return;
    }
    void topCardRef.current?.swipe(direction);
  }, []);

  const visibleProfiles = profiles.slice(0, 3).reverse();

  return (
    <main className="discover-page">
      <header className="discover-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            A LITTLE MORE YOU, A LITTLE MORE THEM
          </div>
          <h1>
            Good things
            <br />
            <span>start with hello.</span>
          </h1>
          <p className="discover-intro">
            Meet people who make the everyday a little more interesting.
          </p>
        </div>
        <div className="discover-counter" aria-live="polite">
          <span className="counter-sparkle" aria-hidden="true">
            ✦
          </span>
          <span>
            <strong>{profiles.length}</strong>
            <small>{profiles.length === 1 ? "person" : "people"} to discover</small>
          </span>
        </div>
      </header>

      <div className="discover-content">
        <section className="discovery-deck" aria-label="Discover profiles">
          <div className="deck-heading">
            <div>
              <span className="deck-kicker">YOUR DISCOVER DECK</span>
              <span className="deck-subtitle">
                One profile at a time, at your pace.
              </span>
            </div>
            <span className="deck-status">
              <span /> READY TO MEET
            </span>
          </div>

          <div className="profile-stage">
            {loading ? (
              <div className="deck-message" role="status">
                <span className="loading-orbit" />
                <p>Finding lovely people for you…</p>
              </div>
            ) : feedError && profiles.length === 0 ? (
              <div className="deck-message" role="alert">
                <span className="empty-sparkle" aria-hidden="true">
                  !
                </span>
                <p>{feedError}</p>
                <button
                  className="text-button"
                  onClick={() => {
                    setLoading(true);
                    setFeedError("");
                    void fetchFeed()
                      .then(setProfiles)
                      .catch((error: unknown) =>
                        setFeedError(
                          error instanceof Error
                            ? error.message
                            : "Profiles could not be loaded.",
                        ),
                      )
                      .finally(() => setLoading(false));
                  }}
                  type="button"
                >
                  Try again
                </button>
              </div>
            ) : profiles.length === 0 ? (
              <div className="deck-message empty-deck">
                <span className="empty-sparkle" aria-hidden="true">
                  ✦
                </span>
                <p className="empty-title">You&apos;re all caught up.</p>
                <p>
                  You&apos;ve met everyone in your deck. New faces will appear
                  here when they arrive.
                </p>
              </div>
            ) : (
              <div className="profile-stack" key={deckVersion}>
                {visibleProfiles.map((profile, depth) => {
                  const isTopCard = depth === visibleProfiles.length - 1;
                  const layer = depth + 1;

                  return (
                    <TinderCard
                      className={`profile-swipe-layer profile-swipe-layer-${layer}`}
                      key={profile.id}
                      ref={isTopCard ? topCardRef : undefined}
                      onSwipe={(direction) => handleSwipe(profile, direction)}
                      onCardLeftScreen={() => handleCardLeftScreen(profile)}
                      onSwipeRequirementFulfilled={(direction) => {
                        if (
                          isTopCard &&
                          (direction === "left" || direction === "right")
                        ) {
                          setSwipeIntent(direction);
                        }
                      }}
                      onSwipeRequirementUnfulfilled={() =>
                        isTopCard && setSwipeIntent(null)
                      }
                      preventSwipe={["up", "down"]}
                      swipeRequirementType="position"
                      swipeThreshold={110}
                    >
                      <ProfileCard
                        profile={profile}
                        depth={visibleProfiles.length - 1 - depth}
                        swipeIntent={isTopCard ? swipeIntent : null}
                      />
                    </TinderCard>
                  );
                })}
              </div>
            )}
          </div>

          <div className="deck-controls">
            <button
              className="swipe-button swipe-button-pass"
              type="button"
              aria-label="Pass on profile"
              disabled={loading || profiles.length === 0 || isSubmitting}
              onClick={() => triggerSwipe("left")}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
            <span className="control-hint">PASS</span>
            <span className="control-or">OR</span>
            <span className="control-hint">SAY HELLO</span>
            <button
              className="swipe-button swipe-button-like"
              type="button"
              aria-label="Like profile"
              disabled={loading || profiles.length === 0 || isSubmitting}
              onClick={() => triggerSwipe("right")}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21s-8.5-5.2-8.5-12A4.8 4.8 0 0 1 12 6.4 4.8 4.8 0 0 1 20.5 9c0 6.8-8.5 12-8.5 12Z" />
              </svg>
            </button>
          </div>
          <p className="swipe-hint">
            <span aria-hidden="true">↔</span> Drag a card or use the buttons
          </p>
          {notice ? (
            <p className="swipe-notice" aria-live="polite">
              {notice}
            </p>
          ) : null}
          {isSubmitting ? (
            <p className="saving-indicator" role="status">
              Saving your choice…
            </p>
          ) : null}
        </section>
      </div>

      {matchedProfile ? (
        <div className="match-overlay">
          <section
            className="match-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="match-title"
          >
            <button
              className="match-close"
              type="button"
              aria-label="Close match message"
              onClick={() => setMatchedProfile(null)}
            >
              ×
            </button>
            <span className="match-stars" aria-hidden="true">
              ✦
            </span>
            <p className="match-kicker">A LOVELY LITTLE BEGINNING</p>
            <h2 id="match-title">It&apos;s a match!</h2>
            <p>
              You and {matchedProfile.name} liked each other. That&apos;s a
              pretty good hello.
            </p>
            <button
              className="match-continue"
              type="button"
              onClick={() => setMatchedProfile(null)}
            >
              Keep discovering
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
