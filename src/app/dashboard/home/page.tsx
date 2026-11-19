import Link from "next/link";

const dateTips = [
  {
    number: "01",
    title: "Start with what lights them up",
    description:
      "A detail in their profile is an easy, thoughtful opener. Ask about the hobby, place, or song they chose to share.",
  },
  {
    number: "02",
    title: "Keep the first date simple",
    description:
      "Coffee, a bookstore, or a walk somewhere lively gives you room to talk without making the moment feel like an interview.",
  },
  {
    number: "03",
    title: "Be curious, not perfect",
    description:
      "You don’t need a clever script. Listen, share a little about yourself, and let the conversation find its own rhythm.",
  },
];

export default function DashboardHomePage() {
  return (
    <main className="home-welcome">
      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-eyebrow">
            <span className="home-eyebrow-mark" aria-hidden="true">
              h♡
            </span>
            A LITTLE MORE ROOM FOR A GOOD HELLO
          </div>
          <h1>
            You never know
            <br />
            where <span>hello</span> might go.
          </h1>
          <p className="home-hero-description">
            heyLiked is a softer way to meet someone new. Start with a shared
            interest, make space for a real conversation, and see where the
            feeling takes you — one easy step at a time.
          </p>
          <div className="home-hero-actions">
            <Link className="home-primary-link" href="/dashboard/discover">
              Meet someone new <span aria-hidden="true">→</span>
            </Link>
            <Link className="home-secondary-link" href="/dashboard/matches">
              Your mutual matches <span aria-hidden="true">♡</span>
            </Link>
          </div>
          <p className="home-quiet-note">
            No perfect lines. No pressure. Just people getting to know people.
          </p>
        </div>

        <div className="home-hero-art" aria-hidden="true">
          <span className="home-art-spark home-art-spark-one">✳</span>
          <span className="home-art-spark home-art-spark-two">✦</span>
          <span className="home-art-orbit home-art-orbit-one" />
          <span className="home-art-orbit home-art-orbit-two" />
          <div className="home-art-note">
            <span className="home-note-dot" />
            A GOOD THING IN THE MAKING
          </div>
          <div className="home-date-card">
            <div className="home-date-card-top">
              <span className="home-mini-mark">h♡</span>
              <span>FIRST DATE NOTES</span>
              <span className="home-card-heart">♡</span>
            </div>
            <div className="home-cafe-illustration">
              <span className="home-cafe-sun" />
              <span className="home-cafe-table" />
              <span className="home-cup home-cup-one" />
              <span className="home-cup home-cup-two" />
              <span className="home-cafe-flower">✿</span>
            </div>
            <p className="home-date-card-title">
              Coffee first.
              <br />
              The rest can wait.
            </p>
            <p className="home-date-card-caption">
              An easy place to talk, laugh,
              <br />
              and be a little bit yourself.
            </p>
            <div className="home-date-card-footer">
              <span>LOW PRESSURE</span>
              <span>✦</span>
              <span>GOOD CONVERSATION</span>
            </div>
          </div>
          <div className="home-art-floating">
            <span className="home-floating-heart">♡</span>
            <span>
              <strong>Start with a spark</strong>
              <small>Let it become your story.</small>
            </span>
          </div>
        </div>
      </section>

      <section className="home-date-guide" id="first-date">
        <div className="home-guide-heading">
          <div>
            <p className="home-section-eyebrow">A NOTE BEFORE YOU GO</p>
            <h2>
              A good date feels
              <br />
              <span>like being at ease.</span>
            </h2>
          </div>
          <p className="home-guide-intro">
            There’s no one right way to meet someone. A little thoughtfulness
            and a plan that feels comfortable to both of you go a long way.
          </p>
        </div>

        <div className="home-tip-grid">
          {dateTips.map((tip) => (
            <article className="home-tip-card" key={tip.number}>
              <span className="home-tip-number">{tip.number}</span>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-closing">
        <div>
          <span className="home-closing-mark" aria-hidden="true">
            h♡
          </span>
          <p>A new story doesn’t need a grand entrance.</p>
          <h2>Sometimes, it just needs a hello.</h2>
        </div>
        <Link className="home-closing-link" href="/dashboard/discover">
          Take a look around <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
