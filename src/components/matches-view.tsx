"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MatchProfile } from "@/types/profile";

export function MatchesView() {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void fetch("/api/matches")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Your matches could not be loaded. Please try again.");
        }
        return (await response.json()) as { matches: MatchProfile[] };
      })
      .then((data) => {
        if (active) {
          setMatches(data.matches);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Your matches could not be loaded. Please try again.",
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

  return (
    <main className="matches-page">
      <header className="matches-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            THE GOOD PART
          </div>
          <h1>
            It&apos;s mutual.
            <br />
            <span>That&apos;s where it begins.</span>
          </h1>
          <p>
            Your likes are private. These are the people who liked you back.
          </p>
        </div>
        <div className="matches-count">
          <span aria-hidden="true">♡</span>
          <strong>{matches.length}</strong>
          <small>{matches.length === 1 ? "match" : "matches"}</small>
        </div>
      </header>

      {loading ? (
        <div className="matches-message" role="status">
          <span className="loading-orbit" />
          <p>Gathering your mutual connections…</p>
        </div>
      ) : error ? (
        <div className="matches-message" role="alert">
          <p>{error}</p>
        </div>
      ) : matches.length === 0 ? (
        <section className="matches-empty">
          <div className="matches-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path
                d="M24 39s-16-9.5-16-22A8.5 8.5 0 0 1 24 13a8.5 8.5 0 0 1 16 4c0 12.5-16 22-16 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m18 24 4 4 8-9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="matches-empty-kicker">GOOD THINGS TAKE THEIR TIME</p>
          <h2>No matches just yet.</h2>
          <p>
            Keep being curious. When you and someone else like each other,
            you&apos;ll find them here.
          </p>
          <Link className="matches-discover-link" href="/dashboard/discover">
            Back to Discover <span aria-hidden="true">→</span>
          </Link>
        </section>
      ) : (
        <section className="matches-grid" aria-label="Your mutual matches">
          {matches.map((match) => (
            <article className="match-card" key={match.id}>
              <div
                className="match-card-photo"
                role="img"
                aria-label={`Photo of ${match.name}`}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(28, 24, 40, 0.02) 25%, rgba(28, 24, 40, 0.76) 100%), url("${match.photo}")`,
                }}
              >
                <span className="match-mutual-badge">
                  <span aria-hidden="true">♡</span> IT&apos;S MUTUAL
                </span>
                <div className="match-card-name">
                  <h2>
                    {match.name}, {match.age}
                  </h2>
                  <p>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {match.city}
                  </p>
                </div>
              </div>
              <div className="match-card-details">
                <p>{match.shortBio}</p>
                <div className="match-card-interests">
                  {match.interests.slice(0, 3).map((interest) => (
                    <span key={interest}>{interest}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
