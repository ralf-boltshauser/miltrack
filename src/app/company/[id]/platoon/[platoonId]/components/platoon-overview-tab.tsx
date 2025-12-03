"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressRing from "../../../components/progress-ring";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Summary = {
  memberCount: number;
  completedTracks: number;
  totalTracks: number;
  completionPercent: number;
  averageScore: number | null;
  topPerformers: {
    id: string;
    name: string;
    percent: number;
    status: "Complete" | "On Track" | "Behind";
  }[];
};

export default function PlatoonOverviewTab({
  summary,
  trend,
}: {
  summary: Summary;
  trend: { date: string; completed: number }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Fortschritt (30 Tage)</CardTitle>
        </CardHeader>
        <CardContent className="h-72 px-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ left: 24, right: 24, top: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorComplete" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickMargin={8} minTickGap={12} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [`${value} Abschlüsse`, "Abgeschlossen"]}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorComplete)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Zug-Übersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <ProgressRing value={summary.completionPercent} size={160} strokeWidth={12}>
              <div className="text-center">
                <div className="text-3xl font-semibold">{summary.completionPercent}%</div>
                <div className="text-xs text-muted-foreground">Abschluss</div>
              </div>
            </ProgressRing>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="Personen" value={summary.memberCount} />
            <Stat
              label="Abgeschlossen"
              value={`${summary.completedTracks}/${summary.totalTracks || 0}`}
            />
            <Stat
              label="Ø Punkte"
              value={summary.averageScore === null ? "—" : summary.averageScore}
            />
            <Stat label="Offen" value={summary.totalTracks - summary.completedTracks} />
          </div>

          <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Top-Leistungen
              </div>
              <div className="space-y-2">
                {summary.topPerformers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Noch keine Abschlüsse.</p>
                ) : (
                  summary.topPerformers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-sm border px-3 py-2"
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.percent}% abgeschlossen</div>
                    </div>
                    <Badge variant="secondary" className={statusClass(member.status)}>
                      {statusLabel(member.status)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-base font-semibold">{value}</span>
    </div>
  );
}

function statusClass(status: "Complete" | "On Track" | "Behind") {
  if (status === "Complete") return "bg-primary/10 text-primary border-primary/20";
  if (status === "On Track") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  return "";
}

function statusLabel(status: "Complete" | "On Track" | "Behind") {
  if (status === "Complete") return "Abgeschlossen";
  if (status === "On Track") return "Im Plan";
  return "Im Rückstand";
}
