import { useState } from "react";
import { DUMMY_DAY_DATA } from "@/data/windData";
import { avgField, calcMAE, formatDate } from "@/utils/chartUtils";
import { DatePickerDropdown } from "@/components/ui/DatePickerDropdown";
import { DailySummary } from "@/components/ui/DailySummary";
import { ForecastHorizonBadge } from "@/components/ui/ForecastHorizonBadge";
import { GenerationChart } from "@/components/GenerationChart";

export default function Charts() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 1));

  // Static dummy data — will be replaced with API call keyed by selectedDate
  const data = DUMMY_DAY_DATA;

  const avgActual   = avgField(data, "actual");
  const avgForecast = avgField(data, "forecast");
  const mae         = calcMAE(data);
  const dateLabel   = formatDate(selectedDate);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">
      <div className="flex flex-col lg:flex-row min-h-[600px]">

        {/* Controls sidebar */}
        <aside className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/70 p-6 flex flex-col gap-5 rounded-l-2xl">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
              Analysis Controls
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[14px] font-semibold text-slate-500">Data Window</h3>
            <DatePickerDropdown value={selectedDate} onChange={setSelectedDate} />
          </div>

          <DailySummary avgActual={avgActual} avgForecast={avgForecast} mae={mae} />

          <ForecastHorizonBadge />
        </aside>

        {/* Chart panel */}
        <GenerationChart data={data} dateLabel={dateLabel} />

      </div>
    </div>
  );
}
