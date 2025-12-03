"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDownWideNarrow, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Member = {
  id: string;
  name: string;
  completed: number;
  total: number;
  percent: number;
  averageScore: number | null;
  status: "Complete" | "On Track" | "Behind";
};

export default function PlatoonMembersTab({ members }: { members: Member[] }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"percent" | "score">("percent");

  const filtered = useMemo(() => {
    return [...members]
      .filter((member) =>
        member.name.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "percent") return b.percent - a.percent;
        const scoreA = a.averageScore ?? 0;
        const scoreB = b.averageScore ?? 0;
        return scoreB - scoreA;
      });
  }, [members, query, sortBy]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-semibold">Personen</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              placeholder="Namen suchen"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          </div>
          <button
            type="button"
            onClick={() => setSortBy(sortBy === "percent" ? "score" : "percent")}
            className="inline-flex h-9 items-center gap-2 rounded-sm border px-3 text-sm"
          >
            <ArrowDownWideNarrow className="size-4" />
            Sortieren nach {sortBy === "percent" ? "Abschluss" : "Punkte"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Fortschritt</th>
                <th className="px-4 py-3 font-medium">Abgeschlossen</th>
                <th className="px-4 py-3 font-medium">Ø Punkte</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{member.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-28">
                        <ProgressBar value={member.percent} />
                      </div>
                      <span className="font-semibold">{member.percent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.completed}/{member.total}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.averageScore === null ? "—" : member.averageScore}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(member.status).variant} className={statusVariant(member.status).className}>
                      {statusVariant(member.status).label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-sm bg-muted">
      <div
        className="h-full rounded-sm bg-primary"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function statusVariant(status: "Complete" | "On Track" | "Behind") {
  if (status === "Complete") {
    return { label: "Abgeschlossen", variant: "default" as const, className: "" };
  }
  if (status === "On Track") {
    return {
      label: "Im Plan",
      variant: "secondary" as const,
      className: "text-emerald-800 border-emerald-200 bg-emerald-50",
    };
  }
  return { label: "Im Rückstand", variant: "destructive" as const, className: "" };
}
