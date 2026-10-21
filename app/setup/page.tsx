import { auth, currentUser } from "@clerk/nextjs/server";
import { MembershipRole, MembershipStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createSchoolAction } from "./actions";

const messages: Record<string, string> = {
  "not-authorized": "This account is not approved to set up the school. Sign in with the designated administrator account.",
  "invalid-name": "Enter a school name between 2 and 120 characters.",
  "already-complete": "Initial school setup has already been completed. Sign in with an active school administrator account.",
  "setup-failed": "We could not finish setup. Please try again or contact support.",
};

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await currentUser();
  if (!user || user.id !== userId) redirect("/login");

  const email = user.emailAddresses.find((address) => address.id === user.primaryEmailAddressId)?.emailAddress;
  const allowedEmail = process.env.SCHOOL_ADMIN_BOOTSTRAP_EMAIL?.trim();
  if (!email || !allowedEmail || email.toLowerCase() !== allowedEmail.toLowerCase()) {
    return (
      <main className="setup-page">
        <section className="setup-card">
          <h1>School setup is restricted</h1>
          <p>This account is not approved to create the school’s first administrator. Sign in with the designated administrator account.</p>
        </section>
      </main>
    );
  }

  const prisma = getPrisma();
  const activeAdmin = await prisma.schoolMembership.findFirst({
    where: {
      role: MembershipRole.ADMIN,
      status: MembershipStatus.ACTIVE,
      user: { clerkUserId: userId },
    },
    select: { id: true },
  });
  if (activeAdmin) redirect("/admin");

  const schoolCount = await prisma.school.count();
  const { error } = await searchParams;

  return (
    <main className="setup-page">
      <section className="setup-card setup-onboarding-card">
        <div className="eyebrow">First-time setup</div>
        <h1>Create your school workspace</h1>
        <p>Set the school name to create its first administrator account. This setup is available only to the designated administrator and only before a school is registered.</p>
        {schoolCount > 0 ? (
          <p role="status">Initial setup has already been completed. Sign in with an active administrator account.</p>
        ) : (
          <form action={createSchoolAction} className="setup-form">
            <label htmlFor="schoolName">School name</label>
            <input id="schoolName" name="schoolName" type="text" minLength={2} maxLength={120} autoComplete="organization" required />
            {error && messages[error] ? <p className="setup-error" role="alert">{messages[error]}</p> : null}
            <button className="primary-button" type="submit">Create school and open admin portal</button>
          </form>
        )}
      </section>
    </main>
  );
}
