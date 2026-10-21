import { notFound } from "next/navigation";
import { PortalShell, type SchoolRole } from "@/components/portal-shell";

const roles: Record<string, SchoolRole> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

const summaries: Record<SchoolRole, { heading: string; intro: string; labels: string[] }> = {
  Admin: { heading: "School overview", intro: "Your school’s records and activity will appear here when the database is connected.", labels: ["Students", "Teachers", "Parents", "Administrators"] },
  Teacher: { heading: "Teaching overview", intro: "Your timetable, classes, attendance, and assessments will appear here after sign-in is connected.", labels: ["My lessons", "My classes", "Attendance", "Assessments"] },
  Student: { heading: "Learning overview", intro: "Your timetable, assignments, results, and announcements will appear here after sign-in is connected.", labels: ["Timetable", "Assignments", "Results", "Attendance"] },
  Parent: { heading: "Family overview", intro: "Your children’s school updates and balances will appear here after sign-in is connected.", labels: ["Children", "Timetables", "Updates", "Fee balances"] },
};

export default async function RoleDashboard({ params }: { params: Promise<{ role: string }> }) {
  const { role: requestedRole } = await params;
  const role = roles[requestedRole.toLowerCase()];
  if (!role) notFound();
  const content = summaries[role];

  return (
    <PortalShell role={role}>
      <div className="page-heading">
        <div><div className="eyebrow">{role} workspace</div><h1>{content.heading}</h1><p>{content.intro}</p></div>
      </div>
      <section aria-label="School summary areas" className="setup-grid">
        {content.labels.map((label) => <article className="setup-tile" key={label}><span>{label}</span><strong aria-label="Not connected">—</strong></article>)}
      </section>
      <section className="setup-card">
        <h2>Getting the portal ready</h2>
        <p>This screen is a design-aligned shell. Clerk authentication, PostgreSQL records, and server-side role permissions will be added before any school data is shown.</p>
        <ol className="next-list">
          <li className="next-item"><span className="next-number">1</span><span>Connect account sign-in and verify the user’s role on the server.</span></li>
          <li className="next-item"><span className="next-number">2</span><span>Connect the database and load only the records this role may see.</span></li>
          <li className="next-item"><span className="next-number">3</span><span>Replace these empty states with the approved dashboard content.</span></li>
        </ol>
      </section>
    </PortalShell>
  );
}
