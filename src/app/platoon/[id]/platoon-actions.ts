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

export type PlatoonWithDetails = NonNullable<
  Awaited<ReturnType<typeof getPlatoonById>>
>;

export async function getTrainingInstancesForPlatoon(id: string) {
  // Get all training instances that have at least one person from this platoon assigned
  const trainingInstances = await prisma.trainingInstance.findMany({
    where: {
      trainingTracks: {
        some: {
          person: {
            platoonId: id,
          },
        },
      },
    },
    include: {
      training: true,
      trainingTracks: {
        where: {
          person: {
            platoonId: id,
          },
        },
        include: {
          person: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  // Calculate completion stats for each training instance
  return trainingInstances.map((instance) => {
    const totalAssigned = instance.trainingTracks.length;
    const completed = instance.trainingTracks.filter(
      (track) => track.completedAt !== null
    ).length;
    const completionRate =
      totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;

    return {
      ...instance,
      stats: {
        totalAssigned,
        completed,
        completionRate,
      },
    };
  });
}

export type TrainingInstanceWithDetails = NonNullable<
  Awaited<ReturnType<typeof getTrainingInstancesForPlatoon>>
>;
