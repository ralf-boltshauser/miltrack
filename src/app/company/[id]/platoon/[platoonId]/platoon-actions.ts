"use server";
import { prisma } from "@/lib/prisma";

export async function getPlatoonById(id: string) {
  return await prisma.platoon.findUnique({
    where: {
      id,
    },
    include: {
      persons: true,
    },
  });
}
