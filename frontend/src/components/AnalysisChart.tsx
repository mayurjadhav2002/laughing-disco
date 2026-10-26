import { useState } from "react";
import { formatDate } from "@/utils/chartUtils";
import { DatePickerDropdown } from "@/components/ui/DatePickerDropdown";
import { DailySummary } from "@/components/ui/DailySummary";
import { ForecastHorizonBadge } from "@/components/ui/ForecastHorizonBadge";
import { GenerationChart } from "@/components/GenerationChart";
import { useDailyProfile } from "@/hooks/useDailyProfile";
import { formatLocalDate } from "@/utils/dateFormatter";

export default function Charts() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 1));

  const formattedQueryDate = formatLocalDate(selectedDate);

  const {
    data: profileData,
    isLoading,
    error,
  } = useDailyProfile(formattedQueryDate);

  const chartData = profileData?.data || [];
  const avgActual = profileData?.avg_actual ?? 0;
  const avgForecast = profileData?.avg_forecast ?? 0;
  const mae = profileData?.daily_mae ?? 0;
  const dateLabel = formatDate(selectedDate);

  return (
    <div className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden w-full">
      <div className="flex flex-col lg:flex-row min-h-0 w-full">
        <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100  p-4 sm:p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
              Analysis Controls
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-[14px] font-semibold text-slate-500">
              Data Window
            </h4>
            <DatePickerDropdown
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>

          <DailySummary
            avgActual={avgActual}
            avgForecast={avgForecast}
            mae={mae}
          />

          <ForecastHorizonBadge />
        </aside>

        <div className="flex-1 min-w-0 w-full overflow-hidden">
          <GenerationChart
            data={chartData}
            dateLabel={dateLabel}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
