import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Circle, Users } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0 space-y-2">
              {/* Training name skeleton */}
              <div className="h-6 w-64 bg-muted animate-pulse rounded" />
              {/* Training description skeleton */}
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card Skeleton */}
      <div className="container mx-auto px-4 pt-6">
        <Card className="mb-6 animate-pulse">
          <CardHeader>
            <CardTitle className="text-lg">Übersicht Abschluss</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-5 w-12 bg-muted rounded" />
              </div>
              <Progress value={0} className="h-3" />
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>

            <Separator />

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    {i === 1 ? (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    ) : i === 2 ? (
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="h-8 w-12 bg-muted rounded mx-auto mb-1" />
                  <div className="h-3 w-16 bg-muted rounded mx-auto" />
                </div>
              ))}
            </div>

            {/* Due Date Skeleton */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-28 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Incomplete Section Skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Circle className="h-5 w-5 text-orange-600" />
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-orange-200 bg-orange-50/50 py-2 animate-pulse"
              >
                <CardContent className="py-1.5!">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-24 bg-muted rounded" />
                    </div>
                    <div className="h-5 w-20 bg-muted rounded shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Section Skeleton */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="border-green-200 bg-green-50/50 py-2 animate-pulse"
              >
                <CardContent className="py-1.5!">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-3 w-36 bg-muted rounded" />
                    </div>
                    <div className="h-5 w-20 bg-muted rounded shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
