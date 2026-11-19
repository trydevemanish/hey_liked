import type { Profile } from "@/types/profile";

type ProfileCardProps = {
  profile: Profile;
  depth: number;
  swipeIntent: "left" | "right" | null;
};

export function ProfileCard({
  profile,
  depth,
  swipeIntent,
}: ProfileCardProps) {
  return (
    <article
      className={`profile-card profile-card-depth-${depth}`}
      aria-label={`${profile.name}, ${profile.age}`}
    >
      <div
        className="profile-card-photo"
        role="img"
        aria-label={`Photo of ${profile.name}`}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20, 23, 38, 0.03) 24%, rgba(20, 23, 38, 0.16) 48%, rgba(20, 23, 38, 0.88) 100%), url("${profile.photo}")`,
        }}
      >
        <div className="profile-photo-topline">
          <span className="profile-photo-brand">
            <span className="profile-brand-sparkle">✦</span> COY DISCOVER
          </span>
          <span className="profile-photo-online">
            <span /> Around now
          </span>
        </div>

        {swipeIntent ? (
          <div
            className={`swipe-stamp ${swipeIntent === "right" ? "is-like" : "is-pass"}`}
            aria-hidden="true"
          >
            {swipeIntent === "right" ? "LIKE" : "PASS"}
          </div>
        ) : null}

        <div className="profile-card-content">
          <div className="profile-location">
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
            {profile.city}
          </div>
          <h2 className="profile-name">
            {profile.name}
            <span className="profile-age">, {profile.age}</span>
            <span className="profile-verified" title="Profile">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="m10 1.5 2.3 1.2 2.6.1 1.2 2.3 2 1.7-.5 2.6.5 2.5-2 1.8-1.2 2.3-2.6.1L10 17.5l-2.3-1.2-2.6-.1-1.2-2.3-2-1.8.5-2.5-.5-2.6 2-1.7 1.2-2.3 2.6-.1z" />
                <path
                  d="m6.8 9.9 2.1 2.1 4.4-4.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </h2>
          <p className="profile-bio">{profile.shortBio}</p>
          <div className="profile-interests" aria-label="Interests">
            {profile.interests.slice(0, 3).map((interest) => (
              <span className="profile-interest" key={interest}>
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
