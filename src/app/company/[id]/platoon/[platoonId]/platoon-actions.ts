"use server";
import { prisma } from "@/lib/prisma";
import { TrainingInstanceStat } from "../../company-actions";

type PlatoonTrack = Awaited<
  ReturnType<
    typeof prisma.trainingTrack.findMany<{
      include: {
        trainingInstance: {
          include: { training: true };
        };
        person: {
          select: { id: true };
        };
      };
    }>
  >
>[number];

type MemberProgress = {
  id: string;
  name: string;
  completed: number;
  total: number;
  percent: number;
  averageScore: number | null;
  status: "Complete" | "On Track" | "Behind";
};

export type PlatoonDetail = {
  id: string;
  name: string;
  companyId: string;
  summary: {
    memberCount: number;
    completedTracks: number;
    totalTracks: number;
    completionPercent: number;
    averageScore: number | null;
    topPerformers: MemberProgress[];
  };
  progressTrend: { date: string; completed: number }[];
  members: MemberProgress[];
  trainings: TrainingInstanceStat[];
};

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

export async function getPlatoonDetail(platoonId: string) {
  const platoon = await prisma.platoon.findUnique({
    where: { id: platoonId },
    include: {
      company: {
        select: { id: true, name: true },
      },
      persons: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!platoon) return null;

  const tracks = await prisma.trainingTrack.findMany({
    where: {
      person: {
        platoonId,
      },
    },
    include: {
      trainingInstance: {
        include: { training: true },
      },
      person: {
        select: { id: true },
      },
    },
  });

  const memberCount = platoon.persons.length;
  const completedTracks = tracks.filter((t) => t.completedAt).length;
  const totalTracks = tracks.length;
  const completionPercent = toIntegerPercent(completedTracks, totalTracks);

  const scoreTracks = tracks.filter((t) => t.points !== null);
  const averageScore = scoreTracks.length
    ? Math.round(
        scoreTracks.reduce((sum, track) => sum + (track.points ?? 0), 0) /
          scoreTracks.length,
      )
    : null;

  const members = platoon.persons.map((person) => {
    const personTracks = tracks.filter((t) => t.person.id === person.id);
    const personCompleted = personTracks.filter((t) => t.completedAt).length;
    const personScoreTracks = personTracks.filter((t) => t.points !== null);
    const personAvg = personScoreTracks.length
      ? Math.round(
          personScoreTracks.reduce((sum, t) => sum + (t.points ?? 0), 0) /
            personScoreTracks.length,
        )
      : null;

    const percent = toIntegerPercent(personCompleted, personTracks.length);
    const status = getStatus(percent);

    return {
      id: person.id,
      name: person.name,
      completed: personCompleted,
      total: personTracks.length,
      percent,
      averageScore: personAvg,
      status,
    } satisfies MemberProgress;
  });

  const topPerformers = [...members]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  const progressTrend = buildProgressTrend(tracks, 30);
  const trainings = buildTrainingStatsFromTracks(tracks, memberCount, platoonId);

  return {
    id: platoon.id,
    name: platoon.name,
    companyId: platoon.companyId,
    summary: {
      memberCount,
      completedTracks,
      totalTracks,
      completionPercent,
      averageScore,
      topPerformers,
    },
    progressTrend,
    members,
    trainings,
  } satisfies PlatoonDetail;
}

function buildProgressTrend(
  tracks: PlatoonTrack[],
  days: number,
) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));

  const map = new Map<string, number>();

  for (const track of tracks) {
    if (!track.completedAt) continue;
    const date = new Date(track.completedAt);
    if (date < start) continue;
    const key = date.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  const points: { date: string; completed: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    points.push({ date: key, completed: map.get(key) ?? 0 });
  }
  return points;
}

function buildTrainingStatsFromTracks(
  tracks: PlatoonTrack[],
  memberCount: number,
  platoonId: string,
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
        totalMembers: memberCount,
        averageScore: null,
        completionByPlatoon: { [platoonId]: 0 },
        scores: [],
        scoreSum: 0,
        scoreCount: 0,
      });
    }

    const stat = map.get(instance.id)!;
    if (track.completedAt) {
      stat.completionCount += 1;
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

function toIntegerPercent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function getStatus(percent: number): MemberProgress["status"] {
  if (percent === 100) return "Complete";
  if (percent >= 80) return "On Track";
  return "Behind";
}
