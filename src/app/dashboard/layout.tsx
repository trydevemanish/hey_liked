import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-main-column">
        <header className="mobile-topbar">
          <span className="brand-mark" aria-hidden="true">
            c
          </span>
          <span className="brand-name">coy</span>
          <span className="mobile-topbar-caption">A little more connection</span>
        </header>
        {children}
      </div>
    </div>
  );
}
