"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlatoonWithDetails,
  TrainingInstanceWithDetails,
} from "./platoon-actions";
import { toggleTrainingTrackCompletion } from "./training/[trainingInstanceId]/training-instance-actions";

type TableCellData = {
  trackId: string | null;
  isCompleted: boolean;
  personId: string;
  trainingInstanceId: string;
  points: number | null;
  requiresPoints: boolean;
};

export default function PlatoonTableView({
  platoon,
  trainingInstances,
}: {
  platoon: PlatoonWithDetails;
  trainingInstances: TrainingInstanceWithDetails;
}) {
  const router = useRouter();
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<TableCellData | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [points, setPoints] = useState<string>("");

  // Build table data matrix: persons (rows) x training instances (columns)
  const tableData: (TableCellData | null)[][] = platoon.persons.map(
    (person) => {
      return trainingInstances.map((instance) => {
        // Find training track for this person and instance
        const track = instance.trainingTracks.find(
          (t) => t.personId === person.id
        );

        if (!track) {
          return null; // Person not assigned to this training
        }

        const requiresPoints = instance.training.maxPoints !== null;
        return {
          trackId: track.id,
          isCompleted: track.completedAt !== null,
          personId: person.id,
          trainingInstanceId: instance.id,
          points: track.points,
          requiresPoints,
        };
      });
    }
  );

  const handleCellClick = (cellData: TableCellData | null) => {
    if (!cellData) return;
    setSelectedCell(cellData);
    setPoints(cellData.points?.toString() || "");
    setDialogOpen(true);
  };

  const handleToggle = () => {
    if (!selectedCell || !selectedCell.trackId) return;

    // If marking as completed and requires points, validate points
    if (!selectedCell.isCompleted && selectedCell.requiresPoints) {
      const pointsNum = parseInt(points);
      if (isNaN(pointsNum) || pointsNum < 0) {
        toast.error("Bitte geben Sie eine gültige Punktzahl ein");
        return;
      }
    }

    setLoadingTrackId(selectedCell.trackId);
    const pointsValue = selectedCell.isCompleted || !selectedCell.requiresPoints 
      ? null 
      : parseInt(points) || null;
    
    const promise = toggleTrainingTrackCompletion(
      selectedCell.trackId,
      selectedCell.isCompleted,
      pointsValue
    );

    toast.promise(promise, {
      loading: selectedCell.isCompleted
        ? "Wird als ausstehend markiert..."
        : "Wird als abgeschlossen markiert...",
      success: () => {
        setLoadingTrackId(null);
        setDialogOpen(false);
        setPoints("");
        router.refresh();
        return selectedCell.isCompleted
          ? "Als ausstehend markiert"
          : "Als abgeschlossen markiert";
      },
      error: (error) => {
        setLoadingTrackId(null);
        return error?.message || "Fehler beim Aktualisieren";
      },
    });
  };

  const getPersonName = (personId: string) => {
    return platoon.persons.find((p) => p.id === personId)?.name || "";
  };

  const getTrainingName = (instanceId: string) => {
    const instance = trainingInstances.find((t) => t.id === instanceId);
    return instance?.name || instance?.training.name || "";
  };

  const getTrainingMaxPoints = (instanceId: string) => {
    const instance = trainingInstances.find((t) => t.id === instanceId);
    return instance?.training.maxPoints;
  };

  // Calculate summary stats for each training instance
  const getSummaryForTraining = (instance: TrainingInstanceWithDetails[number]) => {
    const requiresPoints = instance.training.maxPoints !== null;
    const assignedTracks = instance.trainingTracks;
    const completedTracks = assignedTracks.filter(t => t.completedAt !== null);
    
    if (requiresPoints) {
      // Calculate average points for completed tracks
      const completedWithPoints = completedTracks.filter(t => t.points !== null);
      if (completedWithPoints.length === 0) return null;
      const totalPoints = completedWithPoints.reduce((sum, t) => sum + (t.points || 0), 0);
      const avgPoints = totalPoints / completedWithPoints.length;
      return { type: 'points' as const, value: avgPoints };
    } else {
      // Calculate completion percentage
      const percentage = assignedTracks.length > 0 
        ? (completedTracks.length / assignedTracks.length) * 100 
        : 0;
      return { type: 'percentage' as const, value: percentage };
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse text-[10px] sm:text-xs select-none">
            <thead>
              <tr>
                {/* Sticky first column - Soldier names */}
                <th className="sticky left-0 z-20 bg-background border-r border-b px-1.5 sm:px-2 py-1.5 sm:py-2 text-left font-semibold text-muted-foreground min-w-[80px] sm:min-w-[100px] shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                  Soldat
                </th>
                {/* Training instance columns */}
                {trainingInstances.map((instance) => (
                  <th
                    key={instance.id}
                    className={`border-b border-r px-1 sm:px-2 py-1.5 sm:py-2 text-center font-semibold text-muted-foreground cursor-pointer transition-colors min-w-[70px] sm:min-w-[80px] ${
                      selectedColumn === instance.id
                        ? "bg-primary/10"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() =>
                      setSelectedColumn(
                        selectedColumn === instance.id ? null : instance.id
                      )
                    }
                  >
                    <div className="flex flex-col items-center gap-0.5 max-w-[70px] sm:max-w-[80px]">
                      <span className="text-[10px] leading-tight truncate w-full text-center">
                        {instance.name || instance.training.name}
                      </span>
                      {instance.name &&
                        instance.training.name !== instance.name && (
                          <span className="text-[9px] text-muted-foreground leading-tight truncate w-full text-center">
                            {instance.training.name}
                          </span>
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {platoon.persons.map((person, rowIndex) => (
                <tr key={person.id} className="hover:bg-muted/30">
                  {/* Sticky first column - Soldier name */}
                  <td className="sticky left-0 z-10 bg-background border-r border-b px-1.5 sm:px-2 py-1.5 sm:py-2 font-medium shadow-[2px_0_4px_rgba(0,0,0,0.05)] max-w-[80px] sm:max-w-[100px]">
                    <span className="truncate block">{person.name}</span>
                  </td>
                  {/* Training cells */}
                  {tableData[rowIndex].map((cellData, colIndex) => {
                    const instance = trainingInstances[colIndex];
                    const isHighlighted =
                      selectedColumn === instance.id && cellData !== null;

                    return (
                      <td
                        key={`${person.id}-${instance.id}`}
                      className={`border-r border-b px-1 sm:px-2 py-1.5 sm:py-2 text-center transition-colors ${
                        isHighlighted ? "bg-primary/10" : ""
                      } ${
                        cellData
                          ? "cursor-pointer hover:bg-muted/50 active:bg-muted"
                          : "bg-muted/20"
                      }`}
                        onClick={() => handleCellClick(cellData)}
                      >
                        {cellData ? (
                          <div className="flex items-center justify-center">
                            {loadingTrackId === cellData.trackId ? (
                              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                            ) : cellData.isCompleted ? (
                              cellData.requiresPoints && cellData.points !== null ? (
                                <span className="text-[10px] font-semibold text-green-600">
                                  {cellData.points}
                                </span>
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              )
                            ) : (
                              <Circle className="h-4 w-4 text-orange-600" />
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Summary Row */}
              <tr className="bg-muted/50 font-semibold">
                <td className="sticky left-0 z-10 bg-muted border-r border-b px-1.5 sm:px-2 py-1.5 sm:py-2 shadow-[2px_0_4px_rgba(0,0,0,0.05)] font-semibold">
                  %
                </td>
                {trainingInstances.map((instance) => {
                  const summary = getSummaryForTraining(instance);
                  return (
                    <td
                      key={instance.id}
                      className={`bg-muted/50 border-r border-b px-1 sm:px-2 py-1.5 sm:py-2 text-center ${
                        selectedColumn === instance.id ? "bg-primary/10" : ""
                      }`}
                    >
                      {summary ? (
                        summary.type === 'points' ? (
                          <span className="text-[10px] font-semibold text-green-600">
                            Ø {summary.value.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold">
                            {summary.value.toFixed(0)}%
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Toggle Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Status ändern</DialogTitle>
            <DialogDescription>
              {selectedCell && (
                <>
                  Möchten Sie den Status für{" "}
                  <strong>{getPersonName(selectedCell.personId)}</strong> im
                  Training{" "}
                  <strong>{getTrainingName(selectedCell.trainingInstanceId)}</strong>{" "}
                  {selectedCell.isCompleted
                    ? "als ausstehend markieren"
                    : "als abgeschlossen markieren"}
                  ?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedCell && !selectedCell.isCompleted && selectedCell.requiresPoints && (
            <div className="space-y-2 py-4">
              <Label htmlFor="points">Punkte *</Label>
              <Input
                id="points"
                type="number"
                min="0"
                max={getTrainingMaxPoints(selectedCell.trainingInstanceId) || undefined}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Punkte eingeben"
                disabled={loadingTrackId !== null}
              />
              {getTrainingMaxPoints(selectedCell.trainingInstanceId) && (
                <p className="text-xs text-muted-foreground">
                  Maximal {getTrainingMaxPoints(selectedCell.trainingInstanceId)} Punkte
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loadingTrackId !== null}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleToggle}
              disabled={loadingTrackId !== null}
            >
              {loadingTrackId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird aktualisiert...
                </>
              ) : selectedCell?.isCompleted ? (
                "Als ausstehend markieren"
              ) : (
                "Als abgeschlossen markieren"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

