"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@/generated/prisma/client";
import { MembershipRole, MembershipStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function primaryEmailFor(user: NonNullable<Awaited<ReturnType<typeof currentUser>>>) {
  return user.emailAddresses.find((address) => address.id === user.primaryEmailAddressId)?.emailAddress;
}

export async function createSchoolAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await currentUser();
  if (!user || user.id !== userId) redirect("/login");

  const email = primaryEmailFor(user)?.trim().toLowerCase();
  const allowedEmail = process.env.SCHOOL_ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  if (!email || !allowedEmail || email !== allowedEmail) redirect("/setup?error=not-authorized");

  const schoolName = String(formData.get("schoolName") ?? "").trim();
  if (schoolName.length < 2 || schoolName.length > 120) redirect("/setup?error=invalid-name");

  const slug = schoolName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  if (!slug) redirect("/setup?error=invalid-name");

  const prisma = getPrisma();
  const existingAdmin = await prisma.schoolMembership.findFirst({
    where: {
      role: MembershipRole.ADMIN,
      status: MembershipStatus.ACTIVE,
      user: { clerkUserId: userId },
    },
    select: { id: true },
  });
  if (existingAdmin) redirect("/admin");

  try {
    await prisma.$transaction(
      async (transaction) => {
        if (await transaction.school.count()) throw new Error("SETUP_ALREADY_COMPLETED");

        const account = await transaction.userAccount.upsert({
          where: { clerkUserId: userId },
          update: { email, displayName: [user.firstName, user.lastName].filter(Boolean).join(" ") || email },
          create: {
            clerkUserId: userId,
            email,
            displayName: [user.firstName, user.lastName].filter(Boolean).join(" ") || email,
          },
          select: { id: true },
        });

        const school = await transaction.school.create({
          data: { name: schoolName, slug },
          select: { id: true },
        });

        await transaction.schoolMembership.create({
          data: {
            schoolId: school.id,
            userId: account.id,
            role: MembershipRole.ADMIN,
            status: MembershipStatus.ACTIVE,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "SETUP_ALREADY_COMPLETED") {
      redirect("/setup?error=already-complete");
    }
    redirect("/setup?error=setup-failed");
  }

  redirect("/admin");
}
