"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTraining } from "../../company-actions";

export default function TrainingCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxPoints, setMaxPoints] = useState<string>("");
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Name wird benötigt");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
        maxPoints: maxPoints ? Number(maxPoints) : null,
        enabled,
      };
      const result = await createTraining(payload);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Training wurde erstellt");
        setName("");
        setDescription("");
        setMaxPoints("");
        setEnabled(true);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Training konnte nicht erstellt werden");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Training erfassen</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div className="space-y-2">
            <Label htmlFor="name">Name*</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. San Ausbildung"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional, kurze Beschreibung"
              disabled={isLoading}
              className="flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxPoints">Maximale Punkte</Label>
              <Input
                id="maxPoints"
                type="number"
                min="0"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
                placeholder="z.B. 120"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={enabled}
                  onCheckedChange={(v) => setEnabled(Boolean(v))}
                  disabled={isLoading}
                  className="checkbox-olive"
                />
                Aktiviert
              </label>
              <p className="text-xs text-muted-foreground">
                Deaktiviere, falls das Training aktuell nicht verfügbar sein soll.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Speichern..." : "Training erstellen"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
