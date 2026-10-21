import { notFound } from "next/navigation";
import { PortalShell, type SchoolRole } from "@/components/portal-shell";

const roles: Record<string, SchoolRole> = { admin: "Admin", teacher: "Teacher", student: "Student", parent: "Parent" };
const labels: Record<string, string> = {
  students: "Students", teachers: "Teachers", attendance: "Attendance", results: "Results & exams", fees: "Fees & payments",
  calendar: "School calendar", "design-system": "Design system", timetable: "Timetable", assessments: "Exams & assignments",
  assignments: "Assignments", children: "My children", messages: "Messages", profile: "Profile & settings",
};

export default async function PortalSection({ params }: { params: Promise<{ role: string; section: string }> }) {
  const { role: requestedRole, section } = await params;
  const role = roles[requestedRole.toLowerCase()];
  const label = labels[section];
  if (!role || !label) notFound();

  return (
    <PortalShell role={role} section={section}>
      <div className="page-heading"><div><div className="eyebrow">{role} workspace</div><h1>{label}</h1><p>This section will be connected to approved school records in a later implementation step.</p></div></div>
      <section className="setup-card">
        <h2>Section scaffold</h2>
        <p>The layout and role-specific navigation are in place. Sign-in, permissions, validation, and live data must be connected before this section is used with school records.</p>
      </section>
    </PortalShell>
  );
}
