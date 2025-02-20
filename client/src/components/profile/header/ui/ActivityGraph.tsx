import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { DailyActivity } from "@/types/profile";
import { pipe } from "lodash/fp";

interface ActivityGraphProps {
  dailyActivities: DailyActivity[];
}

interface DayInfo {
  date: Date;
  dateStr: string;
  count: number;
}

interface WeekInfo {
  days: DayInfo[];
  weekNumber: number;
}

interface ActivityData {
  weeks: WeekInfo[];
  months: string[];
  activityMap: Map<string, number>;
}

// 순수 함수
const formatDate = (date: Date): string => date.toISOString().split("T")[0]; // "2025-02-20"

const subDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(date.getDate() - days);
  return result;
};

const getMonthName = (date: Date): string => date.toLocaleString("en-US", { month: "short" });

const getColorClass = (count: number): string =>
  pipe(
    (c: number) => {
      if (c === 0) return 100;
      if (c < 5) return 200;
      if (c < 10) return 300;
      if (c < 20) return 400;
      return 500;
    },
    (level: number) => `bg-${level === 100 ? "gray" : "green"}-${level}`
  )(count);

// 데이터 변환 파이프라인
const createActivityMapFromData = (activities: DailyActivity[]): Map<string, number> =>
  new Map(activities.map((activity) => [activity.date, activity.viewCount]));

const TOTAL_DAYS = 365;

const generateDayInfo =
  (baseDate: Date, activityMap: Map<string, number>) =>
  (dayOffset: number): DayInfo => {
    const daysToAdjust = baseDate.getDay();

    const date = subDays(baseDate, TOTAL_DAYS - daysToAdjust - dayOffset);
    const dateStr = formatDate(date);
    return {
      date,
      dateStr,
      count: activityMap.get(dateStr) || 0,
    };
  };

const generateWeekInfo =
  (baseDate: Date, activityMap: Map<string, number>) =>
  (weekNumber: number): WeekInfo => {
    const generateDay = generateDayInfo(baseDate, activityMap);
    const currentDayOfWeek = baseDate.getDay();
    const daysToAdjust = currentDayOfWeek;

    const days = Array.from({ length: 7 }, (_, day) => {
      const dayIndex = weekNumber * 7 + day;
      const date = subDays(baseDate, TOTAL_DAYS - daysToAdjust - dayIndex);

      if (weekNumber === 51 && day > currentDayOfWeek) {
        return null;
      }

      if (date > baseDate) {
        return null;
      }

      return dayIndex < 365 ? generateDay(dayIndex) : null;
    }).filter(Boolean) as DayInfo[];

    return { days, weekNumber };
  };

const processActivityData = (activities: DailyActivity[], baseDate: Date): ActivityData => {
  const activityMap = createActivityMapFromData(activities);

  const processWeeks = pipe(
    () => [...Array(52)].map((_, i) => i),
    (weeks: number[]) => weeks.map((weekNumber) => generateWeekInfo(baseDate, activityMap)(weekNumber))
  );

  const processMonths = pipe(
    () => [...Array(53)].map((_, i) => i * 7),
    (indices: number[]) => indices.map((i) => subDays(baseDate, 364 - i)),
    (dates: Date[]) => dates.map(getMonthName),
    (months: string[]) => Array.from(new Set(months))
  );

  return {
    weeks: processWeeks(),
    months: processMonths(),
    activityMap,
  };
};

// 개별 날짜 셀을 표시하는 컴포넌트
const DayCell = ({ dayInfo }: { dayInfo: DayInfo }) => (
  <Tooltip>
    <TooltipTrigger>
      <div className={`w-2.5 h-2.5 rounded-sm ${getColorClass(dayInfo.count)}`} />
    </TooltipTrigger>
    <TooltipContent>
      <p>{`${dayInfo.dateStr}: ${dayInfo.count} views`}</p>
    </TooltipContent>
  </Tooltip>
);

// 한 주의 데이터를 표시하는 컴포넌트
const Week = ({ weekInfo }: { weekInfo: WeekInfo }) => (
  <div className="grid grid-rows-7 gap-0.5">
    {weekInfo.days.map((day) => (
      <DayCell key={day.dateStr} dayInfo={day} />
    ))}
  </div>
);

const DayLabels = () => (
  <div className="flex flex-col justify-between text-xs text-gray-400 pr-2">
    <span className="translate-y-2">Mon</span>
    <span>Wed</span>
    <span className="-translate-y-2">Fri</span>
  </div>
);

// 월 라벨을 표시하는 컴포넌트
const MonthLabels = ({ weeks }: { weeks: WeekInfo[] }) => {
  const monthPositions = weeks.reduce(
    (acc, week, index) => {
      const firstDayOfWeek = week.days[0];
      const month = firstDayOfWeek.date.toLocaleString("en-US", { month: "short" });

      if (index === 0 || month !== weeks[index - 1].days[0].date.toLocaleString("en-US", { month: "short" })) {
        acc.push({
          month,
          position: `${index * 0.75}rem`,
        });
      }
      return acc;
    },
    [] as Array<{ month: string; position: string }>
  );

  return (
    <div className="flex mb-5 pl-6">
      <div className="relative flex">
        {monthPositions.map(({ month, position }, index) => (
          <div key={`${month}-${index}`} className="absolute text-xs text-gray-400" style={{ left: position }}>
            {month}
          </div>
        ))}
      </div>
    </div>
  );
};

// 범주 표시하는 컴포넌트
const Legend = () => (
  <div className="mt-4 flex items-center text-xs text-gray-500 space-x-2">
    <span>Less</span>
    <div className="flex space-x-0.5">
      <div className="w-3 h-3 bg-gray-100 rounded-sm" />
      <div className="w-3 h-3 bg-green-200 rounded-sm" />
      <div className="w-3 h-3 bg-green-300 rounded-sm" />
      <div className="w-3 h-3 bg-green-400 rounded-sm" />
      <div className="w-3 h-3 bg-green-500 rounded-sm" />
    </div>
    <span>More</span>
  </div>
);

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
