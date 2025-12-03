"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingInstanceStat } from "../../../company-actions";

export default function PlatoonTrainingsTab({
  trainings,
}: {
  trainings: TrainingInstanceStat[];
}) {
  if (!trainings.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Ausbildungen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Noch keine Ausbildungen für diesen Zug erfasst.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Ausbildungen</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {trainings.map((training) => {
            const completionPercent = training.totalMembers
              ? Math.round((training.completionCount / training.totalMembers) * 100)
              : 0;
            const status = getStatusBadge(completionPercent);

            return (
              <AccordionItem value={training.id} key={training.id} className="border rounded-sm mb-2">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex flex-1 items-center justify-between gap-3 text-left">
                    <div>
                      <div className="text-sm font-semibold">{training.name}</div>
                      <div className="text-xs text-muted-foreground">{training.trainingName}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant} className={status.className}>
                        {status.label}
                      </Badge>
                      <span className="text-sm font-semibold">{completionPercent}%</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                    <ProgressBar value={completionPercent} />
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div>
                        <div className="text-xs uppercase tracking-wide">Abschluss</div>
                        <div className="font-semibold text-foreground">
                          {training.completionCount} / {training.totalMembers}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide">Ø Punkte</div>
                        <div className="font-semibold text-foreground">
                          {training.averageScore === null ? "—" : training.averageScore}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide">Max Punkte</div>
                        <div className="font-semibold text-foreground">
                          {training.maxPoints === null ? "—" : training.maxPoints}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide">Erfasste Punkte</div>
                        <div className="font-semibold text-foreground">{training.scores.length}</div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
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

function getStatusBadge(percent: number) {
  if (percent >= 80) return { label: "Im Plan", variant: "default" as const, className: "" };
  if (percent >= 50)
    return {
      label: "Mittel",
      variant: "secondary" as const,
      className: "text-amber-700 border-amber-200 bg-amber-50",
    };
  return { label: "Im Rückstand", variant: "destructive" as const, className: "" };
}
