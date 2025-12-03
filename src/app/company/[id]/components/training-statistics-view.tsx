"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BarChart3, Search } from "lucide-react";
import { useMemo, useState } from "react";
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
            <Card key={training.id} className="border-muted">
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
              </CardContent>
            </Card>
          );
        })}
      </div>
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
