"use server";

import { prisma } from "@/lib/prisma";

export async function getPlatoonIdFromTrainingInstance(
  trainingInstanceId: string
): Promise<string | null> {
  // Get first training track to extract platoonId
  const track = await prisma.trainingTrack.findFirst({
    where: {
      trainingInstanceId: trainingInstanceId,
    },
    include: {
      person: {
        select: {
          platoonId: true,
        },
      },
    },
  });

  return track?.person.platoonId || null;
}

export async function getTrainingInstanceByIdForPlatoon(
  trainingInstanceId: string,
  platoonId: string
) {
  const trainingInstance = await prisma.trainingInstance.findUnique({
    where: {
      id: trainingInstanceId,
    },
    include: {
      training: true,
      trainingTracks: {
        where: {
          person: {
            platoonId: platoonId,
          },
        },
        include: {
          person: {
            include: {
              platoon: true,
            },
          },
        },
        orderBy: [
          {
            completedAt: {
              sort: "asc",
            },
          },
          {
            person: {
              name: "asc",
            },
          },
        ],
      },
    },
  });

  if (!trainingInstance) {
    return null;
  }

  // Get platoon info from first track (all tracks are from same platoon)
  const platoon = trainingInstance.trainingTracks[0]?.person.platoon || null;

  // Separate completed and incomplete
  const incomplete = trainingInstance.trainingTracks.filter(
    (track) => track.completedAt === null
  );
  const completed = trainingInstance.trainingTracks.filter(
    (track) => track.completedAt !== null
  );

  const total = trainingInstance.trainingTracks.length;
  const completedCount = completed.length;
  const completionRate = total > 0 ? (completedCount / total) * 100 : 0;

  return {
    ...trainingInstance,
    platoon,
    incomplete,
    completed,
    stats: {
      total,
      completed: completedCount,
      incomplete: incomplete.length,
      completionRate,
    },
  };
}

export type TrainingInstanceDetail = NonNullable<
  Awaited<ReturnType<typeof getTrainingInstanceByIdForPlatoon>>
>;

export async function toggleTrainingTrackCompletion(
  trainingTrackId: string,
  isCompleted: boolean,
  points?: number | null
) {
  try {
    await prisma.trainingTrack.update({
      where: {
        id: trainingTrackId,
      },
      data: {
        completedAt: isCompleted ? null : new Date(),
        points: isCompleted ? null : points ?? null,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error toggling training track completion:", error);
    throw new Error("Fehler beim Aktualisieren des Status");
  }
}
