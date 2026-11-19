"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/dashboard/home", label: "Home", icon: "home" },
  { href: "/dashboard/discover", label: "Discover", icon: "discover" },
] as const;

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return navigation.map((item) => {
    const active = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`dashboard-nav-link${active ? " is-active" : ""}${mobile ? " is-mobile" : ""}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {item.icon === "home" ? (
            <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          ) : (
            <>
              <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
              <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
            </>
          )}
        </svg>
        <span>{item.label}</span>
        {active && !mobile ? <span className="dashboard-nav-indicator" /> : null}
      </Link>
    );
  });
}

export function DashboardSidebar() {
  return (
    <>
      <aside className="dashboard-sidebar">
        <Link className="brand-lockup" href="/dashboard/discover">
          <span className="brand-mark" aria-hidden="true">
            c
          </span>
          <span className="brand-name">coy</span>
        </Link>

        <div className="sidebar-caption">YOUR SPACE</div>
        <nav className="sidebar-navigation" aria-label="Main navigation">
          <NavigationLinks />
        </nav>

        <div className="sidebar-note">
          <span className="sidebar-note-icon" aria-hidden="true">
            ✦
          </span>
          <p>Good connections start with being yourself.</p>
        </div>

        <div className="sidebar-profile">
          <span className="sidebar-avatar" aria-hidden="true">
            Y
          </span>
          <span>
            <strong>Your profile</strong>
            <small>Demo account</small>
          </span>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </div>
      </aside>

      <nav className="mobile-navigation" aria-label="Main navigation">
        <NavigationLinks mobile />
      </nav>
    </>
  );
}
