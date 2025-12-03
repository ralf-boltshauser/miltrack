"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Activity, BarChart3, Loader2, Users } from "lucide-react";
import { useState } from "react";
import AddPersonDialog from "./add-person-dialog";
import { CompanyOverview } from "./company-actions";
import CompanyStatsCards from "./components/company-stats-cards";
import PlatoonProgressCard from "./components/platoon-progress-card";
import TrainingStatisticsView from "./components/training-statistics-view";

export default function CompanyDetail({ company }: { company: CompanyOverview }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/company/${company.id}/export`);
      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${sanitizeFilename(company.name)}-export.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Company export failed", error);
      window.alert("Export fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-sm bg-primary/10 p-2 text-primary">
            <Activity className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">{company.name}</h1>
            <p className="text-sm text-muted-foreground">
              Übersicht der Ausbildungsbereitschaft der Kompanie
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden sm:inline-flex"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <BarChart3 className="mr-2 size-4" />
            )}
            {isExporting ? "Exportiere..." : "Exportieren"}
          </Button>
          <AddPersonDialog
            company={{ id: company.id, name: company.name, platoons: company.platoons }}
          />
        </div>
      </header>

      <CompanyStatsCards summary={company.summary} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-sm bg-secondary p-2 text-secondary-foreground">
              <Users className="size-4" />
            </div>
            <h2 className="text-base font-semibold">Fortschritt der Züge</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {company.platoons.map((platoon) => (
            <PlatoonProgressCard key={platoon.id} platoon={platoon} companyId={company.id} />
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <Card className="border-none shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-base font-semibold">
              Ausbildungsstatistiken
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <TrainingStatisticsView
              trainingStats={company.trainingStats}
              platoons={company.platoons.map((p) => ({
                id: p.id,
                name: p.name,
                memberCount: p.memberCount,
              }))}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
