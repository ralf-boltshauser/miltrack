"use server";

import { prisma } from "@/lib/prisma";

type TrainingTrackWithRelations = Awaited<
  ReturnType<typeof prisma.trainingTrack.findMany>
>[number];

export type CompanyOverview = {
  id: string;
  name: string;
  platoons: {
    id: string;
    name: string;
    memberCount: number;
    persons: { id: string; name: string }[];
    completedTracks: number;
    totalTracks: number;
    progressPercent: number;
  }[];
  summary: {
    totalMembers: number;
    completedTracks: number; // per-person tracks completed
    totalTracks: number; // per-person tracks total
    completionPercent: number;
    averageScore: number | null;
  };
  trainingStats: TrainingInstanceStat[];
};

export type TrainingInstanceStat = {
  id: string;
  name: string;
  trainingName: string;
  maxPoints: number | null;
  completionCount: number;
  totalMembers: number;
  averageScore: number | null;
  completionByPlatoon: Record<string, number>;
  scores: number[];
};

export async function getCompanyById(id: string) {
  return await prisma.company.findUnique({
    where: {
      id,
    },
    include: {
      platoons: {
        include: {
          persons: {
            include: {
              trainingTracks: {
                include: {
                  trainingInstance: {
                    include: {
                      training: true,
                    },
                  },
                },
              },
            },
          },
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

export async function getCompanyNavigation(id: string) {
  return prisma.company.findUnique({
    where: { id },
    include: {
      platoons: true,
    },
  });
}

function toIntegerPercent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export async function getCompanyOverview(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      platoons: {
        include: {
          persons: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!company) return null;

  const tracks = await prisma.trainingTrack.findMany({
    where: {
      person: {
        platoon: { companyId },
      },
    },
    include: {
      person: {
        select: {
          platoonId: true,
        },
      },
      trainingInstance: {
        include: {
          training: true,
        },
      },
    },
  });

  const totalMembers = company.platoons.reduce(
    (sum, platoon) => sum + platoon.persons.length,
    0,
  );

  const completedTracks = tracks.filter((track) => track.completedAt).length;
  const totalTracks = tracks.length;

  const scoreTracks = tracks.filter((track) => track.points !== null);
  const averageScore = scoreTracks.length
    ? Math.round(
        scoreTracks.reduce((sum, track) => sum + (track.points ?? 0), 0) /
          scoreTracks.length,
      )
    : null;

  const platoonStats = company.platoons.map((platoon) => {
    const platoonTracks = tracks.filter(
      (track) => track.person.platoonId === platoon.id,
    );
    const platoonCompleted = platoonTracks.filter(
      (track) => track.completedAt,
    ).length;

    return {
      id: platoon.id,
      name: platoon.name,
      memberCount: platoon.persons.length,
      persons: platoon.persons,
      completedTracks: platoonCompleted,
      totalTracks: platoonTracks.length,
      progressPercent: toIntegerPercent(
        platoonCompleted,
        platoonTracks.length,
      ),
    };
  });

  const trainingStats = buildTrainingInstanceStats(
    tracks,
    totalMembers,
  );

  return {
    id: company.id,
    name: company.name,
    platoons: platoonStats,
    summary: {
      totalMembers,
      completedTracks,
      totalTracks,
      completionPercent: toIntegerPercent(completedTracks, totalTracks),
      averageScore,
    },
    trainingStats,
  } satisfies CompanyOverview;
}

function buildTrainingInstanceStats(
  tracks: TrainingTrackWithRelations[],
  totalMembers: number,
): TrainingInstanceStat[] {
  const map = new Map<
    string,
    TrainingInstanceStat & { scoreSum: number; scoreCount: number }
  >();

  for (const track of tracks) {
    const instance = track.trainingInstance;
    const training = instance.training;
    if (!map.has(instance.id)) {
      map.set(instance.id, {
        id: instance.id,
        name: instance.name,
        trainingName: training.name,
        maxPoints: training.maxPoints,
        completionCount: 0,
        totalMembers,
        averageScore: null,
        completionByPlatoon: {},
        scores: [],
        scoreSum: 0,
        scoreCount: 0,
      });
    }

    const stat = map.get(instance.id)!;
    if (track.completedAt) {
      stat.completionCount += 1;
      const platoonId = track.person.platoonId;
      stat.completionByPlatoon[platoonId] =
        (stat.completionByPlatoon[platoonId] ?? 0) + 1;
    }

    if (track.points !== null) {
      stat.scoreSum += track.points ?? 0;
      stat.scoreCount += 1;
      stat.scores.push(track.points ?? 0);
    }
  }

  return Array.from(map.values()).map(({ scoreSum, scoreCount, ...stat }) => ({
    ...stat,
    averageScore: scoreCount ? Math.round(scoreSum / scoreCount) : null,
  }));
}

export async function listTrainings() {
  return prisma.training.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCompanyRoster(companyId: string) {
  return prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      name: true,
      platoons: {
        select: {
          id: true,
          name: true,
          persons: {
            select: {
              id: true,
              name: true,
            },
            orderBy: { name: "asc" },
          },
        },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function createTraining(input: {
  name: string;
  description?: string | null;
  maxPoints?: number | null;
  enabled?: boolean;
}) {
  const name = input.name?.trim() ?? "";
  if (!name) {
    return { error: "Name wird benötigt" };
  }

  const maxPoints =
    input.maxPoints === undefined || input.maxPoints === null
      ? null
      : Number.isNaN(Number(input.maxPoints))
        ? null
        : Number(input.maxPoints);

  try {
    const training = await prisma.training.create({
      data: {
        name,
        description: input.description?.trim() || null,
        maxPoints: maxPoints,
        enabled: input.enabled ?? true,
      },
    });
    return { success: true, training };
  } catch (error) {
    console.error("Create training error:", error);
    return { error: "Training konnte nicht erstellt werden" };
  }
}

export async function createTrainingInstance(input: {
  trainingId: string;
  name?: string | null;
  personIds: string[];
}) {
  if (!input.trainingId) return { error: "Training auswählen" };
  const uniquePersonIds = Array.from(new Set(input.personIds));
  if (uniquePersonIds.length === 0) {
    return { error: "Mindestens eine Person auswählen" };
  }

  const training = await prisma.training.findUnique({
    where: { id: input.trainingId },
  });
  if (!training) {
    return { error: "Training nicht gefunden" };
  }

  const instanceName =
    input.name?.trim() && input.name.trim().length > 0
      ? input.name.trim()
      : training.name;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const instance = await tx.trainingInstance.create({
        data: {
          trainingId: training.id,
          name: instanceName,
        },
      });

      if (uniquePersonIds.length > 0) {
        await tx.trainingTrack.createMany({
          data: uniquePersonIds.map((personId) => ({
            personId,
            trainingInstanceId: instance.id,
          })),
        });
      }

      return { instance, createdTracks: uniquePersonIds.length };
    });

    return {
      success: true,
      trainingInstance: result.instance,
      createdTracks: result.createdTracks,
    };
  } catch (error) {
    console.error("Create training instance error:", error);
    return { error: "Training-Instanz konnte nicht erstellt werden" };
  }
}
