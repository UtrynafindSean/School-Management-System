"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type SchoolRole = "Admin" | "Teacher" | "Student" | "Parent";

type NavItem = { label: string; slug: string; icon: string };

const navigation: Record<SchoolRole, { workspace: NavItem[]; management: NavItem[] }> = {
  Admin: {
    workspace: [
      { label: "Overview", slug: "", icon: "⌂" },
      { label: "Students", slug: "students", icon: "▦" },
      { label: "Teachers", slug: "teachers", icon: "♙" },
      { label: "Attendance", slug: "attendance", icon: "✓" },
      { label: "Results & exams", slug: "results", icon: "▤" },
      { label: "Fees & payments", slug: "fees", icon: "₦" },
    ],
    management: [{ label: "School calendar", slug: "calendar", icon: "▣" }, { label: "Design system", slug: "design-system", icon: "◈" }],
  },
  Teacher: {
    workspace: [
      { label: "Overview", slug: "", icon: "⌂" },
      { label: "My timetable", slug: "timetable", icon: "▦" },
      { label: "Attendance", slug: "attendance", icon: "✓" },
      { label: "Exams & assignments", slug: "assessments", icon: "▤" },
      { label: "Results", slug: "results", icon: "◷" },
    ],
    management: [{ label: "School calendar", slug: "calendar", icon: "▣" }, { label: "Messages", slug: "messages", icon: "✉" }, { label: "Profile & settings", slug: "profile", icon: "⚙" }],
  },
  Student: {
    workspace: [
      { label: "Overview", slug: "", icon: "⌂" },
      { label: "My timetable", slug: "timetable", icon: "▦" },
      { label: "Assignments", slug: "assignments", icon: "▤" },
      { label: "Results", slug: "results", icon: "◷" },
      { label: "Attendance", slug: "attendance", icon: "✓" },
    ],
    management: [{ label: "School calendar", slug: "calendar", icon: "▣" }, { label: "Messages", slug: "messages", icon: "✉" }, { label: "Profile & settings", slug: "profile", icon: "⚙" }],
  },
  Parent: {
    workspace: [
      { label: "Overview", slug: "", icon: "⌂" },
      { label: "My children", slug: "children", icon: "♧" },
      { label: "Timetable", slug: "timetable", icon: "▦" },
      { label: "Results", slug: "results", icon: "◷" },
      { label: "Attendance", slug: "attendance", icon: "✓" },
      { label: "Fees & payments", slug: "fees", icon: "₦" },
    ],
    management: [{ label: "School calendar", slug: "calendar", icon: "▣" }, { label: "Messages", slug: "messages", icon: "✉" }, { label: "Profile & settings", slug: "profile", icon: "⚙" }],
  },
};

function rolePath(role: SchoolRole, slug: string) {
  return `/${role.toLowerCase()}${slug ? `/${slug}` : ""}`;
}

export function PortalShell({ role, children, section = "" }: { role: SchoolRole; children: React.ReactNode; section?: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = navigation[role];

  function renderItems(rows: NavItem[]) {
    return rows.map((item) => {
      const href = rolePath(role, item.slug);
      const active = item.slug === section || (!section && !item.slug && pathname === href);
      return (
        <li key={item.slug || "overview"}>
          <Link className="nav-link" href={href} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}
          </Link>
        </li>
      );
    });
  }

  return (
    <div className="portal">
      {menuOpen && <button className="drawer-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className="sidebar" data-open={menuOpen} aria-label={`${role} navigation`}>
        <Link className="brand-lockup" href={`/${role.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-copy">School Portal<small>Learning community</small></span>
        </Link>
        <div className="role-chip"><strong>Current workspace</strong>{role} portal</div>
        <div className="nav-heading">Workspace</div>
        <ul className="nav-list">{renderItems(items.workspace)}</ul>
        <div className="nav-heading">Management</div>
        <ul className="nav-list">{renderItems(items.management)}</ul>
        <div className="sidebar-bottom">Secure access is being connected. Role permissions will be enforced by the server.</div>
      </aside>

      <main className="portal-main">
        <header className="topbar">
          <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">☰</button>
          <div className="topbar-title">{role} portal</div>
          <div className="topbar-right"><span>Preview</span><span className="avatar" aria-hidden="true">{role.slice(0, 1).toUpperCase()}</span></div>
        </header>
        <div className="portal-content">
          <div className="preview-banner"><span className="preview-dot" aria-hidden="true" /><span>Preview only. Sign-in, role checks, and school data are not connected yet.</span></div>
          {children}
        </div>
      </main>
    </div>
  );
}
