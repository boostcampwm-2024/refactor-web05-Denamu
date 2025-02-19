import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { DailyActivity } from "@/types/profile";

interface ActivityGraphProps {
  dailyActivities: DailyActivity[];
}

export const ActivityGraph = ({ dailyActivities }: ActivityGraphProps) => {
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const subDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(date.getDate() - days);
    return result;
  };

  const getMonthName = (date: Date): string => {
    return date.toLocaleString("en-US", { month: "short" });
  };

  const today = new Date();
  const activityMap = new Map(dailyActivities.map((activity) => [activity.date, activity.viewCount]));

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count < 5) return "bg-green-200";
    if (count < 10) return "bg-green-300";
    if (count < 15) return "bg-green-400";
    return "bg-green-500";
  };

  const dayLabels = (
    <div className="flex flex-col justify-between h-full py-1 text-xs text-gray-400">
      <span>Mon</span>
      <span>Wed</span>
      <span>Fri</span>
    </div>
  );

  const weeks = [];
  for (let week = 0; week < 52; week++) {
    const days = [];

    for (let day = 0; day < 7; day++) {
      const dayIndex = week * 7 + day;
      if (dayIndex < 365) {
        const date = subDays(today, 364 - dayIndex);
        const dateStr = formatDate(date);
        const count = activityMap.get(dateStr) || 0;

        days.push(
          <TooltipProvider key={dateStr}>
            <Tooltip>
              <TooltipTrigger>
                <div className={`w-3 h-3 rounded-sm ${getColorClass(count)}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${dateStr}: ${count} views`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    }
    weeks.push(
      <div key={week} className="grid grid-rows-7 gap-1">
        {days}
      </div>
    );
  }

  const months = [];
  let currentMonth = "";
  for (let i = 0; i < 365; i += 7) {
    const date = subDays(today, 364 - i);
    const month = getMonthName(date);
    if (month !== currentMonth) {
      months.push(
        <div key={month} className="text-xs text-gray-400">
          {month}
        </div>
      );
      currentMonth = month;
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Activity</h3>
      <div className="flex flex-col">
        <div className="flex mb-2 pl-7">
          <div className="flex space-x-9">{months}</div>
        </div>
        <div className="flex gap-2">
          {dayLabels}
          <div className="flex gap-1">{weeks}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center text-sm text-gray-500 space-x-2">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 rounded-sm" />
          <div className="w-3 h-3 bg-green-300 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <div className="w-3 h-3 bg-green-500 rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
