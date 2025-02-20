import { TooltipProvider } from "@/components/ui/tooltip.tsx";

import { processActivityData } from "@/utils/activity.ts";

import { DayLabels } from "./DayLabels.tsx";
import { Legend } from "./Legend.tsx";
import { MonthLabels } from "./MonthLabels.tsx";
import { Week } from "./Week.tsx";
import { DailyActivity } from "@/types/profile.ts";

interface ActivityGraphProps {
  dailyActivities: DailyActivity[];
}

export const ActivityGraph = ({ dailyActivities }: ActivityGraphProps) => {
  const today = new Date();
  const { weeks } = processActivityData(dailyActivities, today);

  return (
    <div className="p-4 bg-white rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Activity</h3>
      <TooltipProvider>
        <div className="flex flex-col">
          <MonthLabels weeks={weeks} />
          <div className="flex">
            <DayLabels />
            <div className="flex gap-0.5">
              {weeks.map((weekInfo) => (
                <Week key={weekInfo.weekNumber} weekInfo={weekInfo} />
              ))}
            </div>
          </div>
        </div>
      </TooltipProvider>
      <Legend />
    </div>
  );
};
