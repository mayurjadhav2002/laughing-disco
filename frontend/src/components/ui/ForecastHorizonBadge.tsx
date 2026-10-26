import { Clock } from "lucide-react";

export function ForecastHorizonBadge() {
  return (
    <div className="mt-auto flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-100">
      <div className="p-1.5 bg-indigo-100 rounded-lg mt-0.5 shrink-0">
        <Clock className="w-3.5 h-3.5 text-indigo-600" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
          Forecast Horizon
        </p>
        <p className="text-sm font-bold text-indigo-700 mt-0.5">Day-Ahead (24h)</p>
        <p className="text-[10px] text-indigo-400 mt-0.5 leading-snug">
          Forecasts published 24h prior to delivery
        </p>
      </div>
    </div>
  );
}
