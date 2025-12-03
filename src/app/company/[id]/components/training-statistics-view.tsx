"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BarChart3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrainingInstanceStat } from "../company-actions";

type PlatoonOption = {
  id: string;
  name: string;
  memberCount: number;
};

export default function TrainingStatisticsView({
  trainingStats,
  platoons,
}: {
  trainingStats: TrainingInstanceStat[];
  platoons: PlatoonOption[];
}) {
  const [selectedPlatoon, setSelectedPlatoon] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selectedTraining, setSelectedTraining] = useState<TrainingInstanceStat | null>(null);

  const filtered = useMemo(() => {
    return trainingStats.filter((training) => {
      const matchesQuery = training.name
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [trainingStats, query]);

  const platoonLookup = useMemo(() => {
    const map = new Map<string, PlatoonOption>();
    platoons.forEach((p) => map.set(p.id, p));
    return map;
  }, [platoons]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="size-4" />
          <span>Ausbildungsbereitschaft filtern</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm text-muted-foreground" htmlFor="platoon-filter">
            Zug
          </label>
          <select
            id="platoon-filter"
            className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-48"
            value={selectedPlatoon}
            onChange={(e) => setSelectedPlatoon(e.target.value)}
          >
            <option value="all">Alle Züge</option>
            {platoons.map((platoon) => (
              <option key={platoon.id} value={platoon.id}>
                {platoon.name}
              </option>
            ))}
          </select>
          <div className="relative">
            <Input
              placeholder="Ausbildung suchen"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {filtered.map((training) => {
          const completion = getCompletion(training, selectedPlatoon, platoonLookup);
          const completionPercent = completion.total
            ? Math.round((completion.completed / completion.total) * 100)
            : 0;
          const status = getStatusBadge(completionPercent);

          return (
            <Card
              key={training.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedTraining(training)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedTraining(training);
                }
              }}
              className="border-muted transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">
                      {training.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{training.trainingName}</p>
                  </div>
                  <Badge variant={status.variant} className={status.className}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Abschluss</span>
                  <span className="font-semibold">{completionPercent}%</span>
                </div>
                <ProgressBar value={completionPercent} />
                <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                  <Stat label="Abgeschlossen" value={`${completion.completed} / ${completion.total}`} />
                  <Stat
                    label="Ø Punkte"
                    value={training.averageScore === null ? "—" : training.averageScore}
                  />
                  <Stat
                    label="Max Punkte"
                    value={training.maxPoints === null ? "—" : training.maxPoints}
                  />
                </div>
                <div className="text-right text-xs font-medium text-primary">
                  Details anzeigen →
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DetailDialog
        training={selectedTraining}
        platoons={platoons}
        onClose={() => setSelectedTraining(null)}
      />
    </div>
  );
}

function getCompletion(
  training: TrainingInstanceStat,
  platoonId: string,
  platoonLookup: Map<string, PlatoonOption>,
) {
  if (platoonId === "all") {
    return { completed: training.completionCount, total: training.totalMembers };
  }
  const platoon = platoonLookup.get(platoonId);
  const total = platoon?.memberCount ?? training.totalMembers;
  const completed = training.completionByPlatoon[platoonId] ?? 0;
  return { completed, total };
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-sm bg-muted">
      <div
        className="h-full rounded-sm bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function getStatusBadge(percent: number) {
  if (percent >= 80) {
    return { label: "Im Plan", variant: "default" as const, className: "" };
  }
  if (percent >= 50) {
    return {
      label: "Mittel",
      variant: "secondary" as const,
      className: "text-amber-700 border-amber-200 bg-amber-50",
    };
  }
  return {
    label: "Im Rückstand",
    variant: "destructive" as const,
    className: "",
  };
}

function buildPlatoonBreakdown(
  training: TrainingInstanceStat,
  platoons: PlatoonOption[],
) {
  return platoons
    .map((platoon) => {
      const completed = training.completionByPlatoon[platoon.id] ?? 0;
      const total = platoon.memberCount || training.totalMembers;
      const open = Math.max(0, total - completed);
      const percent = total ? Math.round((completed / total) * 100) : 0;
      return {
        id: platoon.id,
        name: platoon.name,
        completed,
        open,
        total,
        percent,
      };
    })
    .sort((a, b) => b.completed - a.completed);
}

function buildScoreDistribution(
  scores: number[],
  maxPoints: number | null,
) {
  if (!scores.length) return [];
  const observedMax = Math.max(...scores, maxPoints ?? 0, 1);
  const bucketCount = 6;
  const bucketSize = Math.max(1, Math.ceil(observedMax / bucketCount));
  const buckets = Array.from({ length: bucketCount }, (_, i) => {
    const start = i * bucketSize;
    const end = i === bucketCount - 1 ? observedMax : (i + 1) * bucketSize - 1;
    return { label: `${start}–${end}`, start, end, count: 0 };
  });

  for (const score of scores) {
    const bucketIndex =
      score === observedMax
        ? bucketCount - 1
        : Math.min(Math.floor(score / bucketSize), bucketCount - 1);
    buckets[bucketIndex].count += 1;
  }

  return buckets;
}

function DetailDialog({
  training,
  platoons,
  onClose,
}: {
  training: TrainingInstanceStat | null;
  platoons: PlatoonOption[];
  onClose: () => void;
}) {
  const platoonData = useMemo(
    () => (training ? buildPlatoonBreakdown(training, platoons) : []),
    [training, platoons],
  );
  const scoreBins = useMemo(
    () =>
      training
        ? buildScoreDistribution(training.scores, training.maxPoints)
        : [],
    [training],
  );

  const avgScore = training?.averageScore ?? null;

  return (
    <Dialog open={!!training} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        {training && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {training.name}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({training.trainingName})
                </span>
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Beitrag der Züge und Punkteverteilung für diese Ausbildung.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
              <Card className="border-muted/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Zug-Beiträge
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Wie viele Personen pro Zug abgeschlossen haben
                  </p>
                </CardHeader>
                <CardContent className="h-80 px-0 pb-4">
                  {platoonData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Keine Daten vorhanden.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={platoonData}
                        margin={{ left: 24, right: 12, top: 10 }}
                        layout="vertical"
                        barCategoryGap={8}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                          horizontal={false}
                        />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={110}
                          tick={{ fontSize: 12 }}
                        />
                        <RechartsTooltip
                          cursor={{ fill: "rgba(75, 83, 32, 0.08)" }}
                          contentStyle={{
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            borderRadius: 6,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            padding: "10px 14px",
                          }}
                          labelStyle={{
                            color: "#1C1C1C",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                          itemStyle={{
                            color: "#1C1C1C",
                            fontSize: 13,
                            padding: "2px 0",
                          }}
                          formatter={(value: number, key) => {
                            if (key === "completed") return [`${value}`, "Abgeschlossen"];
                            if (key === "open") return [`${value}`, "Offen"];
                            return [value, key];
                          }}
                        />
                        {platoons.length > 0 && (
                          <ReferenceLine
                            x={training.totalMembers / platoons.length}
                            stroke="hsl(var(--secondary-foreground))"
                            strokeDasharray="4 4"
                            label={{
                              position: "insideTopRight",
                              value: "Ø Kompanie",
                              fill: "hsl(var(--secondary-foreground))",
                              fontSize: 11,
                            }}
                          />
                        )}
                        <Bar
                          dataKey="completed"
                          stackId="a"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="open"
                          stackId="a"
                          fill="hsl(var(--muted-foreground)/0.12)"
                          radius={[0, 0, 4, 4]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-rows-[auto_1fr] gap-3">
                <Card className="border-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                      Kennzahlen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <Stat label="Abgeschlossen" value={`${training.completionCount}/${training.totalMembers}`} />
                    <Stat label="Ø Punkte" value={avgScore ?? "—"} />
                    <Stat
                      label="Max Punkte"
                      value={training.maxPoints === null ? "—" : training.maxPoints}
                    />
                    <Stat
                      label="Beste Beteiligung"
                      value={
                        platoonData.length
                          ? `${platoonData[0].name} (${platoonData[0].percent}%)`
                          : "—"
                      }
                    />
                  </CardContent>
                </Card>

                <Card className="border-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                      Punkteverteilung
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Wie oft eine Punktzahl erreicht wurde
                    </p>
                  </CardHeader>
                  <CardContent className="h-64 px-0 pb-4">
                    {scoreBins.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Noch keine Bewertungen vorhanden.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={scoreBins}
                          margin={{ left: 12, right: 12, top: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11 }}
                            tickMargin={8}
                            interval={0}
                          />
                          <YAxis allowDecimals={false} />
                          <RechartsTooltip
                            cursor={{ fill: "rgba(75, 83, 32, 0.08)" }}
                            contentStyle={{
                              background: "#FFFFFF",
                              border: "1px solid #E5E5E5",
                              borderRadius: 6,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              padding: "10px 14px",
                            }}
                            labelStyle={{
                              color: "#1C1C1C",
                              fontWeight: 600,
                              marginBottom: 6,
                            }}
                            itemStyle={{
                              color: "#1C1C1C",
                              fontSize: 13,
                              padding: "2px 0",
                            }}
                            formatter={(value: number) => [`${value}x`, "Anzahl"]}
                          />
                          {avgScore !== null && (() => {
                            const bin = scoreBins.find(
                              (b) => avgScore >= b.start && avgScore <= b.end,
                            );
                            return bin ? (
                              <ReferenceLine
                                x={bin.label}
                                stroke="hsl(var(--primary))"
                                strokeDasharray="4 4"
                                ifOverflow="extendDomain"
                                label={{
                                  value: `Ø ${avgScore}`,
                                  position: "insideTop",
                                  fill: "hsl(var(--primary))",
                                  fontSize: 11,
                                }}
                              />
                            ) : null;
                          })()}
                          <Bar
                            dataKey="count"
                            fill="hsl(var(--primary))"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
