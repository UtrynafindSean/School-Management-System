import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { MembershipRole } from "@/generated/prisma/enums";
import { requireSchoolRole } from "@/lib/auth";

const roleLookup: Record<string, MembershipRole> = {
  admin: MembershipRole.ADMIN,
  teacher: MembershipRole.TEACHER,
  student: MembershipRole.STUDENT,
  parent: MembershipRole.PARENT,
};

export default async function RoleLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ role: string }> }>) {
  const { role: roleSlug } = await params;
  const role = roleLookup[roleSlug.toLowerCase()];
  if (!role) notFound();

  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    await requireSchoolRole(role);
  }

  return children;
}
