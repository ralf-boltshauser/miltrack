"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Target, Users } from "lucide-react";
import ProgressRing from "./progress-ring";

type Summary = {
  totalMembers: number;
  completedTracks: number;
  totalTracks: number;
  completionPercent: number;
  averageScore: number | null;
};

export default function CompanyStatsCards({ summary }: { summary: Summary }) {
  const stats = [
    {
      label: "Kompaniegrösse",
      value: summary.totalMembers,
      sub: "Angehörige der Armee",
      icon: Users,
    },
    {
      label: "Gesamtabschluss Ausbildungseinheiten",
      value: `${summary.completionPercent}%`,
      sub: `${summary.completedTracks}/${summary.totalTracks || 0} Ausbildungseinheiten`,
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Ausbildungsstand
          </CardTitle>
        </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center pb-6 pt-2">
          <ProgressRing value={summary.completionPercent} size={140} strokeWidth={10}>
            <div className="text-center">
              <div className="text-6xl font-semibold leading-none">{summary.completionPercent}%</div>
              <div className="text-xs text-muted-foreground">Abschluss gesamt</div>
            </div>
          </ProgressRing>
        </CardContent>
      </Card>

      {stats.map((stat) => (
        <Card key={stat.label} className="h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <stat.icon className="size-4" />
              <span>{stat.label}</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center space-y-1 pb-6 pt-2">
            <div className="text-6xl font-semibold leading-none text-center">{stat.value}</div>
            {stat.sub && <div className="text-xs text-muted-foreground text-center">{stat.sub}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatPill({
  label,
  value,
  muted,
}: {
  label: string;
  value: string | number;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-sm border px-3 py-2 text-sm",
        muted && "text-muted-foreground",
      )}
    >
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
