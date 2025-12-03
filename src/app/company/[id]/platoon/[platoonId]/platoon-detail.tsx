"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  LayoutPanelLeft,
  ListChecks,
  Loader2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { PlatoonDetail as PlatoonDetailData } from "./platoon-actions";
import PlatoonMembersTab from "./components/platoon-members-tab";
import PlatoonOverviewTab from "./components/platoon-overview-tab";
import PlatoonTrainingsTab from "./components/platoon-trainings-tab";

const tabs = [
  { id: "overview", label: "Übersicht", icon: LayoutPanelLeft },
  { id: "members", label: "Personen", icon: Users },
  { id: "trainings", label: "Ausbildungen", icon: ListChecks },
];

export default function PlatoonDetail({ platoon }: { platoon: PlatoonDetailData }) {
  const [active, setActive] = useState<string>("overview");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/platoon/${platoon.id}/export`);
      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${sanitizeFilename(platoon.name)}-export.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Platoon export failed", error);
      window.alert("Export fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/company/${platoon.companyId}`} className="inline-flex items-center gap-1 text-primary">
              <ChevronLeft className="size-4" /> Zur Kompanie
            </Link>
          </div>
          <h1 className="text-lg font-semibold leading-tight">{platoon.name}</h1>
          <p className="text-sm text-muted-foreground">Zug-Übersicht zur Einsatzbereitschaft</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : null}
            {isExporting ? "Exportiere..." : "Exportieren"}
          </Button>
        </div>
      </header>

      <Card className="border-none shadow-none">
        <CardContent className="px-0">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors ${active === tab.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted/50"}`}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </div>
          <Separator className="my-4" />
          {active === "overview" && (
            <PlatoonOverviewTab summary={platoon.summary} trend={platoon.progressTrend} />
          )}
          {active === "members" && <PlatoonMembersTab members={platoon.members} />}
          {active === "trainings" && <PlatoonTrainingsTab trainings={platoon.trainings} />}
        </CardContent>
      </Card>
    </div>
  );
}
