"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createTrainingInstance } from "../../company-actions";

type Training = {
  id: string;
  name: string;
  description: string | null;
  maxPoints: number | null;
  enabled: boolean;
};

type CompanyRoster = {
  id: string;
  name: string;
  platoons: {
    id: string;
    name: string;
    persons: {
      id: string;
      name: string;
    }[];
  }[];
};

export default function TrainingInstanceForm({
  company,
  trainings,
}: {
  company: CompanyRoster;
  trainings: Training[];
}) {
  const router = useRouter();
  const allPersonIds = useMemo(
    () => company.platoons.flatMap((p) => p.persons.map((person) => person.id)),
    [company],
  );

  const [trainingId, setTrainingId] = useState<string>(trainings[0]?.id ?? "");
  const [instanceName, setInstanceName] = useState("");
  const [selectedPersonIds, setSelectedPersonIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Preselect whole company by default
  useEffect(() => {
    setSelectedPersonIds(new Set(allPersonIds));
  }, [allPersonIds]);

  const toggleCompany = (checked: boolean) => {
    setSelectedPersonIds(checked ? new Set(allPersonIds) : new Set());
  };

  const togglePlatoon = (platoonId: string, checked: boolean) => {
    const platoon = company.platoons.find((p) => p.id === platoonId);
    if (!platoon) return;
    setSelectedPersonIds((prev) => {
      const next = new Set(prev);
      platoon.persons.forEach((person) => {
        if (checked) {
          next.add(person.id);
        } else {
          next.delete(person.id);
        }
      });
      return next;
    });
  };

  const togglePerson = (personId: string, checked: boolean) => {
    setSelectedPersonIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(personId);
      } else {
        next.delete(personId);
      }
      return next;
    });
  };

  const isCompanyChecked = selectedPersonIds.size === allPersonIds.length;
  const isCompanyIndeterminate =
    selectedPersonIds.size > 0 && selectedPersonIds.size < allPersonIds.length;

  const platoonState = useMemo(() => {
    const map = new Map<
      string,
      { checked: boolean; indeterminate: boolean; total: number; selected: number }
    >();
    company.platoons.forEach((platoon) => {
      const personIds = platoon.persons.map((p) => p.id);
      const selected = personIds.filter((id) => selectedPersonIds.has(id)).length;
      const total = personIds.length;
      map.set(platoon.id, {
        checked: selected === total && total > 0,
        indeterminate: selected > 0 && selected < total,
        total,
        selected,
      });
    });
    return map;
  }, [company.platoons, selectedPersonIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!trainingId) {
      setError("Bitte ein Training auswählen");
      return;
    }
    if (selectedPersonIds.size === 0) {
      setError("Mindestens eine Person auswählen");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createTrainingInstance({
        trainingId,
        name: instanceName,
        personIds: Array.from(selectedPersonIds),
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(
          `Instanz erstellt (${result.createdTracks} Personen zugeordnet)`,
        );
        setInstanceName("");
        // keep selection as-is to allow multiple creations quickly
        router.push(`/company/${company.id}`);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Training-Instanz konnte nicht erstellt werden");
    } finally {
      setIsLoading(false);
    }
  };

  if (!trainings.length) {
    return (
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Training-Instanz</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Es sind noch keine Trainings vorhanden. Bitte zuerst ein Training anlegen.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Training-Instanz erfassen</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="training">Training*</Label>
              <select
                id="training"
                value={trainingId}
                onChange={(e) => {
                  setTrainingId(e.target.value);
                  const selectedTraining = trainings.find(
                    (t) => t.id === e.target.value,
                  );
                  if (selectedTraining && !instanceName.trim()) {
                    setInstanceName(selectedTraining.name);
                  }
                }}
                disabled={isLoading}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Training auswählen</option>
                {trainings.map((training) => (
                  <option key={training.id} value={training.id}>
                    {training.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Instanz-Name</Label>
              <Input
                id="name"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                placeholder="Standard: Trainingsname"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-muted p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Teilnehmende auswählen</p>
                <p className="text-xs text-muted-foreground">
                  Standard: ganze Kompanie vorausgewählt. Du kannst Züge oder einzelne Personen abwählen.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TriCheckbox
                  checked={isCompanyChecked}
                  indeterminate={isCompanyIndeterminate}
                  onChange={(checked) => toggleCompany(checked)}
                  disabled={isLoading}
                />
                <span>Gesamte Kompanie</span>
              </div>
            </div>

            <div className="divide-y divide-border rounded-md border border-border">
              {company.platoons.map((platoon) => {
                const state = platoonState.get(platoon.id);
                return (
                  <div key={platoon.id} className="p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TriCheckbox
                          checked={state?.checked ?? false}
                          indeterminate={state?.indeterminate ?? false}
                          onChange={(checked) => togglePlatoon(platoon.id, checked)}
                          disabled={isLoading}
                        />
                        <span className="text-sm font-medium">{platoon.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {state?.selected ?? 0}/{state?.total ?? 0} ausgewählt
                      </span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {platoon.persons.map((person) => (
                        <label
                          key={person.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm hover:border-border"
                        >
                          <Checkbox
                            checked={selectedPersonIds.has(person.id)}
                            onCheckedChange={(v) => togglePerson(person.id, Boolean(v))}
                            disabled={isLoading}
                            className="checkbox-olive"
                          />
                          <span>{person.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Ausgewählt: {selectedPersonIds.size} / {allPersonIds.length} Personen
            </p>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Speichern..." : "Instanz erstellen"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function TriCheckbox({
  checked,
  indeterminate,
  onChange,
  disabled,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Checkbox
      checked={indeterminate ? "indeterminate" : checked}
      onCheckedChange={(value) => onChange(Boolean(value))}
      disabled={disabled}
      className="checkbox-olive"
    />
  );
}
