"use server";

import { prisma } from "@/lib/prisma";

/**
 * Gets the first company ID for redirect after login.
 * Returns null if no companies exist.
 */
export async function getFirstCompanyId(): Promise<string | null> {
  const firstCompany = await prisma.company.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
    },
  });

  return firstCompany?.id ?? null;
}

