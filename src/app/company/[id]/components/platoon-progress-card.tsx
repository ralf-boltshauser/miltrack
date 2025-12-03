"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

type PlatoonProgress = {
  id: string;
  name: string;
  memberCount: number;
  completedTracks: number;
  totalTracks: number;
  progressPercent: number;
};

export default function PlatoonProgressCard({
  platoon,
  companyId,
}: {
  platoon: PlatoonProgress;
  companyId: string;
}) {
  const statusVariant = getStatusVariant(platoon.progressPercent);

  return (
    <Link href={`/company/${companyId}/platoon/${platoon.id}`}>
      <Card className="h-full transition-transform hover:-translate-y-1 hover:shadow-md">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">
                {platoon.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" />
                <span>{platoon.memberCount} Personen</span>
              </div>
            </div>
            <Badge className={cn(statusVariant.className)} variant={statusVariant.variant}>
              {statusVariant.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fortschritt</span>
            <span className="font-semibold">{platoon.progressPercent}%</span>
          </div>
          <ProgressBar value={platoon.progressPercent} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Abgeschlossen {platoon.completedTracks}</span>
            <span>Gesamt {platoon.totalTracks}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            Details anzeigen
            <ArrowRight className="size-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
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

function getStatusVariant(percent: number) {
  if (percent >= 80) {
    return { label: "Im Plan", variant: "default" as const, className: "" };
  }
  if (percent >= 50) {
    return {
      label: "Achtung",
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
