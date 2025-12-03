"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar, LayoutGrid, Table2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  PlatoonWithDetails,
  TrainingInstanceWithDetails,
} from "./platoon-actions";
import PlatoonTableView from "./platoon-table-view";

export default function PlatoonDetail({
  platoon,
  trainingInstances,
}: {
  platoon: PlatoonWithDetails;
  trainingInstances: TrainingInstanceWithDetails;
}) {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  // Separate completed and incomplete training instances
  const incompleteTrainingInstances = trainingInstances.filter(
    (instance) => instance.stats.completed < instance.stats.totalAssigned
  );
  const completedTrainingInstances = trainingInstances.filter(
    (instance) =>
      instance.stats.completed === instance.stats.totalAssigned &&
      instance.stats.totalAssigned > 0
  );

  // Calculate overall training progress
  const totalTrainingInstances = trainingInstances.length;
  const completedTrainingInstancesCount = completedTrainingInstances.length;
  const overallProgress =
    totalTrainingInstances > 0
      ? (completedTrainingInstancesCount / totalTrainingInstances) * 100
      : 0;

  // Reusable training card component
  const TrainingCard = ({
    instance,
  }: {
    instance: TrainingInstanceWithDetails[number];
  }) => {
    const { stats } = instance;
    const isOverdue = new Date(instance.dueDate) < new Date();
    const daysUntilDue = Math.ceil(
      (new Date(instance.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return (
      <Link
        href={`/platoon/${platoon.id}/training/${instance.id}`}
        className="block"
      >
        <Card className="transition-all hover:shadow-md active:scale-[0.98]">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-tight">
                  {instance.name || instance.training.name}
                </CardTitle>
                {instance.name && instance.training.name !== instance.name && (
                  <CardDescription className="mt-1">
                    {instance.training.name}
                  </CardDescription>
                )}
              </div>
              {isOverdue && (
                <Badge variant="destructive" className="shrink-0">
                  Überfällig
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Fertigstellung</span>
                <span className="font-medium">
                  {stats.completed} / {stats.totalAssigned}
                </span>
              </div>
              <Progress value={stats.completionRate} className="h-2.5" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{Math.round(stats.completionRate)}% abgeschlossen</span>
                <span>{stats.totalAssigned - stats.completed} verbleibend</span>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2 text-sm pt-2 border-t">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Fällig:</span>
              <span
                className={
                  isOverdue
                    ? "font-medium text-destructive"
                    : daysUntilDue <= 7
                    ? "font-medium text-orange-600"
                    : "font-medium"
                }
              >
                {format(new Date(instance.dueDate), "d. MMM yyyy", {
                  locale: de,
                })}
              </span>
              {!isOverdue && daysUntilDue <= 7 && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {daysUntilDue === 0
                    ? "Heute"
                    : daysUntilDue === 1
                    ? "Morgen"
                    : `${daysUntilDue} Tage`}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight">
                {platoon.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {platoon.persons.length}{" "}
                {platoon.persons.length === 1 ? "Soldat" : "Soldaten"}
              </p>
            </div>
            {/* View Toggle */}
            <div className="flex gap-1 border rounded-sm p-0.5 shrink-0">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setViewMode("cards")}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setViewMode("table")}
              >
                <Table2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Overall Training Progress */}
          {totalTrainingInstances > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Gesamtfortschritt
                </span>
                <span className="font-semibold">
                  {completedTrainingInstancesCount} / {totalTrainingInstances}
                </span>
              </div>
              <Progress value={overallProgress} className="h-2.5" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {Math.round(overallProgress)}% aller Trainings abgeschlossen
                </span>
                <span>{incompleteTrainingInstances.length} offen</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Training Instances */}
      <div
        className={
          viewMode === "table" ? "w-full pt-6" : "container mx-auto px-4 pt-6"
        }
      >
        {viewMode === "table" ? (
          <PlatoonTableView
            platoon={platoon}
            trainingInstances={trainingInstances}
          />
        ) : (
          <div className="space-y-4">
            {/* Archived (Completed) Training Instances */}
            {completedTrainingInstances.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="archived" className="border-none">
                  <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline py-2 px-0">
                    <span className="text-xs font-normal">
                      Archiviert ({completedTrainingInstances.length})
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-0">
                    <div className="space-y-3">
                      {completedTrainingInstances.map((instance) => (
                        <TrainingCard key={instance.id} instance={instance} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Incomplete Training Instances */}
            {incompleteTrainingInstances.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Keine Trainingszuweisungen für diesen Zug gefunden.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {incompleteTrainingInstances.map((instance) => (
                  <TrainingCard key={instance.id} instance={instance} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
