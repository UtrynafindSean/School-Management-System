import { auth } from "@clerk/nextjs/server";
import { MembershipRole, MembershipStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireSchoolRole(role: MembershipRole) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const prisma = getPrisma();
  const membership = await prisma.schoolMembership.findFirst({
    where: {
      role,
      status: MembershipStatus.ACTIVE,
      user: { clerkUserId: userId },
    },
    select: { id: true, schoolId: true, role: true },
  });

  if (!membership) redirect("/login?access=denied");
  return membership;
}
