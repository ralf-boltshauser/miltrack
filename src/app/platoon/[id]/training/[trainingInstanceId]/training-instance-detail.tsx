"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Loader2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  TrainingInstanceDetail,
  toggleTrainingTrackCompletion,
} from "./training-instance-actions";

export default function TrainingInstanceDetailComponent({
  trainingInstance,
  platoonId,
}: {
  trainingInstance: TrainingInstanceDetail;
  platoonId: string;
}) {
  const router = useRouter();
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<{
    trackId: string;
    personName: string;
    isCompleted: boolean;
    currentPoints: number | null;
  } | null>(null);
  const [points, setPoints] = useState<string>("");
  const { stats, incomplete, completed, training } = trainingInstance;
  const isOverdue = new Date(trainingInstance.dueDate) < new Date();
  const requiresPoints = training.maxPoints !== null;

  const handleCellClick = (
    trackId: string,
    currentlyCompleted: boolean,
    personName: string,
    currentPoints: number | null
  ) => {
    setSelectedTrack({
      trackId,
      personName,
      isCompleted: currentlyCompleted,
      currentPoints,
    });
    setPoints(currentPoints?.toString() || "");
    setDialogOpen(true);
  };

  const handleToggle = () => {
    if (!selectedTrack) return;

    // If marking as completed and requires points, validate points
    if (!selectedTrack.isCompleted && requiresPoints) {
      const pointsNum = parseInt(points);
      if (isNaN(pointsNum) || pointsNum < 0) {
        toast.error("Bitte geben Sie eine gültige Punktzahl ein");
        return;
      }
    }

    setLoadingTrackId(selectedTrack.trackId);
    const pointsValue =
      selectedTrack.isCompleted || !requiresPoints
        ? null
        : parseInt(points) || null;

    const promise = toggleTrainingTrackCompletion(
      selectedTrack.trackId,
      selectedTrack.isCompleted,
      pointsValue
    );

    toast.promise(promise, {
      loading: selectedTrack.isCompleted
        ? `${selectedTrack.personName} wird als ausstehend markiert...`
        : `${selectedTrack.personName} wird als abgeschlossen markiert...`,
      success: () => {
        setLoadingTrackId(null);
        setDialogOpen(false);
        setSelectedTrack(null);
        setPoints("");
        router.refresh();
        return selectedTrack.isCompleted
          ? `${selectedTrack.personName} wurde als ausstehend markiert`
          : `${selectedTrack.personName} wurde als abgeschlossen markiert`;
      },
      error: (error) => {
        setLoadingTrackId(null);
        return error?.message || "Fehler beim Aktualisieren des Status";
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href={`/platoon/${platoonId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold tracking-tight truncate">
                {trainingInstance.name || training.name}
              </h1>
              {trainingInstance.name &&
                training.name !== trainingInstance.name && (
                  <p className="text-sm text-muted-foreground truncate">
                    {training.name}
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="container mx-auto px-4 pt-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Übersicht Abschluss</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gesamtfortschritt</span>
                <span className="font-semibold text-lg">
                  {Math.round(stats.completionRate)}%
                </span>
              </div>
              <Progress value={stats.completionRate} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{stats.completed} abgeschlossen</span>
                <span>{stats.incomplete} verbleibend</span>
              </div>
            </div>

            <Separator />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Zugewiesen</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
                <p className="text-xs text-muted-foreground">Abgeschlossen</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Circle className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.incomplete}
                </p>
                <p className="text-xs text-muted-foreground">Ausstehend</p>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2 text-sm pt-2 border-t">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Fälligkeitsdatum:</span>
              <span
                className={
                  isOverdue ? "font-medium text-destructive" : "font-medium"
                }
              >
                {format(new Date(trainingInstance.dueDate), "d. MMM yyyy", {
                  locale: de,
                })}
              </span>
              {isOverdue && (
                <Badge variant="destructive" className="ml-auto">
                  Überfällig
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Incomplete Section */}
        {incomplete.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Circle className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold">
                Ausstehend ({incomplete.length})
              </h2>
            </div>
            <div className="">
              {incomplete.map((track) => (
                <Card
                  key={track.id}
                  className="border-orange-200 bg-orange-50/50 transition-all hover:shadow-md active:scale-[0.98] cursor-pointer py-2"
                  onClick={() =>
                    handleCellClick(
                      track.id,
                      false,
                      track.person.name,
                      track.points
                    )
                  }
                >
                  <CardContent className="py-1.5!">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {track.person.name}
                        </p>
                        {track.person.platoon && (
                          <p className="text-xs text-muted-foreground truncate">
                            {track.person.platoon.name}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="border-orange-300 text-orange-700 shrink-0 text-xs"
                      >
                        {loadingTrackId === track.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Ausstehend"
                        )}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {completed.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold">
                Abgeschlossen ({completed.length})
              </h2>
            </div>
            <div className="">
              {completed.map((track) => (
                <Card
                  key={track.id}
                  className="border-green-200 bg-green-50/50 transition-all hover:shadow-md active:scale-[0.98] cursor-pointer py-2"
                  onClick={() =>
                    handleCellClick(
                      track.id,
                      true,
                      track.person.name,
                      track.points
                    )
                  }
                >
                  <CardContent className="py-1.5!">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {track.person.name}
                        </p>
                        {track.person.platoon && (
                          <p className="text-xs text-muted-foreground truncate">
                            {track.person.platoon.name}
                          </p>
                        )}
                        {track.completedAt && (
                          <p className="text-xs text-muted-foreground">
                            Abgeschlossen:{" "}
                            {format(
                              new Date(track.completedAt),
                              "d. MMM yyyy",
                              { locale: de }
                            )}
                          </p>
                        )}
                        {track.points !== null &&
                          track.points !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              Punkte: {track.points}
                            </p>
                          )}
                      </div>
                      <Badge
                        variant="outline"
                        className="border-green-300 text-green-700 shrink-0 text-xs"
                      >
                        {loadingTrackId === track.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : requiresPoints && track.points !== null ? (
                          <span className="font-semibold">
                            {track.points} Pkt
                          </span>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Erledigt
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {incomplete.length === 0 && completed.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Keine Soldaten diesem Training zugewiesen.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Toggle Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Status ändern</DialogTitle>
            <DialogDescription>
              {selectedTrack && (
                <>
                  Möchten Sie den Status für{" "}
                  <strong>{selectedTrack.personName}</strong> im Training{" "}
                  <strong>{trainingInstance.name || training.name}</strong>{" "}
                  {selectedTrack.isCompleted
                    ? "als ausstehend markieren"
                    : "als abgeschlossen markieren"}
                  ?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedTrack && !selectedTrack.isCompleted && requiresPoints && (
            <div className="space-y-2 py-4">
              <Label htmlFor="points">Punkte *</Label>
              <Input
                id="points"
                type="number"
                min="0"
                max={training.maxPoints || undefined}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Punkte eingeben"
                disabled={loadingTrackId !== null}
              />
              {training.maxPoints && (
                <p className="text-xs text-muted-foreground">
                  Maximal {training.maxPoints} Punkte
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedTrack(null);
                setPoints("");
              }}
              disabled={loadingTrackId !== null}
            >
              Abbrechen
            </Button>
            <Button onClick={handleToggle} disabled={loadingTrackId !== null}>
              {loadingTrackId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird aktualisiert...
                </>
              ) : selectedTrack?.isCompleted ? (
                "Als ausstehend markieren"
              ) : (
                "Als abgeschlossen markieren"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
