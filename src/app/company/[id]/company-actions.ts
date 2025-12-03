"use server";

import { prisma } from "@/lib/prisma";

export async function getCompanyById(id: string) {
  return await prisma.company.findUnique({
    where: {
      id,
    },
    include: {
      platoons: {
        include: {
          persons: true,
        },
      },
    },
  });
}

export type CompanyWithDetails = NonNullable<
  Awaited<ReturnType<typeof getCompanyById>>
>;

export async function createPerson(name: string, platoonId: string) {
  try {
    const person = await prisma.person.create({
      data: {
        name,
        platoonId,
      },
    });
    return { success: true, person };
  } catch (error) {
    console.error("Create person error:", error);
    return { error: "Failed to create person" };
  }
}
