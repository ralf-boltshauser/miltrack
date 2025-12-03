import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LayoutGrid, Table2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 space-y-2">
              {/* Platoon name skeleton */}
              <div className="h-7 w-48 bg-muted animate-pulse rounded" />
              {/* Person count skeleton */}
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
            {/* View Toggle */}
            <div className="flex gap-1 border rounded-sm p-0.5 shrink-0">
              <Button variant="default" size="sm" className="h-7 px-2" disabled>
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2" disabled>
                <Table2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Overall Training Progress Skeleton */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            </div>
            <Progress value={0} className="h-2.5" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-40 bg-muted animate-pulse rounded" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Training Instances Skeleton */}
      <div className="container mx-auto px-4 pt-6">
        <div className="space-y-4">
          {/* Training Card Skeletons */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Training name skeleton */}
                    <div className="h-5 w-64 bg-muted rounded" />
                    {/* Training description skeleton */}
                    <div className="h-4 w-48 bg-muted rounded" />
                  </div>
                  {/* Badge skeleton */}
                  <div className="h-5 w-20 bg-muted rounded shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar Skeleton */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                  </div>
                  <Progress value={0} className="h-2.5" />
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                </div>

                {/* Due Date Skeleton */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <div className="h-4 w-4 bg-muted rounded" />
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-4 w-28 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
