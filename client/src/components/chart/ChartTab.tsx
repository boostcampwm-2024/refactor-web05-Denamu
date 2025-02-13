import { lazy, Suspense } from "react";

import ChartSkeleton from "@/components/chart/ChartSkeleton.tsx";

const Chart = lazy(() => import("@/components/chart/Chart"));

export default function ChartTab() {
  return (
    <Suspense fallback={<ChartSkeleton data-testid="chart-skeleton" />}>
      <Chart />
    </Suspense>
  );
}
