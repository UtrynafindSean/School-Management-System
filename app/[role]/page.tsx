import { notFound } from "next/navigation";
import { PortalShell, type SchoolRole } from "@/components/portal-shell";

export const instant = false;

const roles: Record<string, SchoolRole> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

const summaries: Record<SchoolRole, { heading: string; intro: string; labels: string[] }> = {
  Admin: { heading: "School overview", intro: "Your school workspace is ready. Add school records as each management feature becomes available.", labels: ["Students", "Teachers", "Parents", "Administrators"] },
  Teacher: { heading: "Teaching overview", intro: "Your timetable, classes, attendance, and assessments will appear here as those records are added.", labels: ["My lessons", "My classes", "Attendance", "Assessments"] },
  Student: { heading: "Learning overview", intro: "Your timetable, assignments, results, and announcements will appear here as those records are added.", labels: ["Timetable", "Assignments", "Results", "Attendance"] },
  Parent: { heading: "Family overview", intro: "Your children’s school updates and balances will appear here as those records are added.", labels: ["Children", "Timetables", "Updates", "Fee balances"] },
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
        <h2>Next steps for your school</h2>
        <p>Your administrator account and school workspace are set up. The next implementation steps are to add the school profile, student and staff records, and attendance, results, and fee workflows.</p>
        <ol className="next-list">
          <li className="next-item"><span className="next-number">1</span><span>Complete the school profile and academic year.</span></li>
          <li className="next-item"><span className="next-number">2</span><span>Add student, teacher, and class records.</span></li>
          <li className="next-item"><span className="next-number">3</span><span>Connect attendance, results, and fee workflows.</span></li>
        </ol>
      </section>
    </PortalShell>
  );
}
